import { createServiceClient } from "../_shared/supabase.ts";
import { sendTemplatedEmail } from "../_shared/email.ts";
import { brandedPage } from "../_shared/html.ts";
import { extractPathToken, htmlResponse } from "../_shared/http.ts";
import {
  formatDisplayDate,
  formatSlotLabel,
} from "../_shared/format.ts";

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return htmlResponse(
      brandedPage({ title: "Method not allowed", message: "Use the link from your email." }),
      405
    );
  }

  const token = extractPathToken(req, "confirm-booking");
  if (!token) {
    return htmlResponse(
      brandedPage({
        title: "Invalid link",
        message: "This link is invalid.",
      }),
      404
    );
  }

  try {
    const supabase = createServiceClient();
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        status,
        confirmation_token,
        confirmation_deadline,
        appointment_date,
        appointment_time,
        businesses ( name, prep_instructions ),
        clients ( name, email ),
        services ( name )
      `
      )
      .eq("confirmation_token", token)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!booking) {
      return htmlResponse(
        brandedPage({
          title: "Invalid link",
          message: "This link is invalid.",
        }),
        404
      );
    }

    if (booking.status !== "pending_payment") {
      return htmlResponse(
        brandedPage({
          title: "Already processed",
          message: "This booking has already been processed.",
        }),
        409
      );
    }

    const deadline = booking.confirmation_deadline
      ? new Date(String(booking.confirmation_deadline))
      : null;
    if (deadline && Date.now() > deadline.getTime()) {
      return htmlResponse(
        brandedPage({
          title: "Confirmation window expired",
          message:
            "This confirmation window has expired — the slot has been released.",
        }),
        410
      );
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: "confirmed", deposit_paid: true })
      .eq("id", booking.id);

    if (updateError) throw new Error(updateError.message);

    const business = booking.businesses as {
      name: string;
      prep_instructions: string | null;
    } | null;
    const client = booking.clients as { name: string; email: string | null } | null;
    const service = booking.services as { name: string } | null;
    const time = String(booking.appointment_time).slice(0, 5);
    const cancelToken = booking.confirmation_token ?? token;

    if (client?.email) {
      const sections =
        business?.prep_instructions?.trim()
          ? [
              {
                heading: "Before your appointment",
                body: business.prep_instructions.trim(),
              },
            ]
          : undefined;

      await sendTemplatedEmail({
        to: client.email,
        subject: "Your appointment is confirmed!",
        title: "Your appointment is confirmed!",
        intro: `Hi ${client.name}, your appointment with ${business?.name ?? "your stylist"} is confirmed. We look forward to seeing you.`,
        rows: [
          { label: "Service", value: service?.name ?? "—" },
          {
            label: "Date",
            value: formatDisplayDate(String(booking.appointment_date)),
          },
          { label: "Time", value: formatSlotLabel(time) },
          { label: "Salon", value: business?.name ?? "—" },
        ],
        sections,
        linkUrl: `${siteUrl}/cancel-booking/${cancelToken}`,
        linkLabel: "Cancel my appointment",
        footer: "If you need to reschedule, please contact your stylist directly.",
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${siteUrl}/booking-confirmed?booking_id=${booking.id}`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return htmlResponse(
      brandedPage({
        title: "Something went wrong",
        message,
      }),
      500
    );
  }
});
