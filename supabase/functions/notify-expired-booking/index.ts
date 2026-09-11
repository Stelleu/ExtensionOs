import { createServiceClient } from "../_shared/supabase.ts";
import { sendTemplatedEmail } from "../_shared/email.ts";
import { corsHeaders, jsonResponse } from "../_shared/http.ts";
import { formatDisplayDate } from "../_shared/format.ts";

type ExpiredRow = {
  id: string;
  appointment_date: string;
  businesses: { name: string; slug: string } | null;
  clients: { name: string; email: string | null } | null;
  services: { name: string } | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabase = createServiceClient();
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

    let bookingIds: string[] | null = null;
    try {
      const body = await req.json();
      if (Array.isArray(body?.booking_ids)) {
        bookingIds = body.booking_ids.filter((id: unknown) => typeof id === "string");
      }
    } catch {
      bookingIds = null;
    }

    if (!bookingIds) {
      const { data: expired, error: findError } = await supabase
        .from("bookings")
        .select("id")
        .eq("status", "pending_payment")
        .lt("confirmation_deadline", new Date().toISOString());

      if (findError) throw new Error(findError.message);
      bookingIds = (expired ?? []).map((row) => row.id);

      if (bookingIds.length > 0) {
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            status: "cancelled",
            cancelled_reason: "payment_not_confirmed",
          })
          .in("id", bookingIds);

        if (updateError) throw new Error(updateError.message);
      }
    }

    if (bookingIds.length === 0) {
      return jsonResponse({ expired: 0, emails_sent: 0 });
    }

    const { data: rows, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        appointment_date,
        businesses ( name, slug ),
        clients ( name, email ),
        services ( name )
      `
      )
      .in("id", bookingIds)
      .eq("cancelled_reason", "payment_not_confirmed");

    if (error) throw new Error(error.message);

    let emailsSent = 0;
    for (const row of (rows ?? []) as ExpiredRow[]) {
      const clientEmail = row.clients?.email;
      const slug = row.businesses?.slug;
      if (!clientEmail || !slug) continue;

      try {
        await sendTemplatedEmail({
          to: clientEmail,
          subject: "Your booking wasn't confirmed in time",
          title: "Your slot has been released",
          intro: `Hi ${row.clients?.name ?? "there"}, your booking for ${row.services?.name ?? "your service"} on ${formatDisplayDate(String(row.appointment_date))} wasn't confirmed in time and the slot has been released. If you'd still like to book, you're welcome to try again on our booking page.`,
          ctaUrl: `${siteUrl}/${slug}`,
          ctaLabel: "Book again",
          const contact = business.instagram
          ? `Instagram: @${business.instagram}`
          : business.email
          ? `Email: ${business.email}`
          : business.phone
          ? `Phone: ${business.phone}`
          : '';
          body: `<p>If this was a mistake, please contact ${business.name} directly: ${contact}</p>`,
        });
        
        emailsSent += 1;
      } catch (emailErr) {
        console.error("notify-expired-booking email failed", row.id, emailErr);
      }
    }

    return jsonResponse({
      expired: bookingIds.length,
      emails_sent: emailsSent,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return jsonResponse({ error: message }, 500);
  }
});
