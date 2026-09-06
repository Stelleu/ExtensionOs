import { createServiceClient } from "../_shared/supabase.ts";
import { sendTemplatedEmail } from "../_shared/email.ts";
import {
  formatDisplayDate,
  formatPrice,
  formatSlotLabel,
} from "../_shared/format.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { booking_id } = await req.json();
    if (!booking_id || typeof booking_id !== "string") {
      return new Response(JSON.stringify({ error: "booking_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createServiceClient();
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        appointment_date,
        appointment_time,
        deposit_amount,
        confirmation_token,
        businesses ( name, email ),
        clients ( name ),
        services ( name )
      `
      )
      .eq("id", booking_id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const business = booking.businesses as {
      name: string;
      email: string | null;
    } | null;
    const client = booking.clients as { name: string } | null;
    const service = booking.services as { name: string } | null;

    if (!business?.email) {
      return new Response(JSON.stringify({ error: "Business email missing" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!booking.confirmation_token) {
      return new Response(
        JSON.stringify({ error: "Booking missing confirmation_token" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const time = String(booking.appointment_time).slice(0, 5);
    const confirmUrl = `${siteUrl}/confirm-booking/${booking.confirmation_token}`;

    await sendTemplatedEmail({
      to: business.email,
      subject: `New booking — ${client?.name ?? "Client"}`,
      title: "New booking request",
      intro: `${client?.name ?? "A client"} has booked ${service?.name ?? "a service"}. Confirm once you've received their deposit.`,
      rows: [
        { label: "Service", value: service?.name ?? "—" },
        {
          label: "Date",
          value: formatDisplayDate(String(booking.appointment_date)),
        },
        { label: "Time", value: formatSlotLabel(time) },
        {
          label: "Deposit",
          value: formatPrice(Number(booking.deposit_amount)),
        },
      ],
      ctaUrl: confirmUrl,
      ctaLabel: "Confirm deposit received",
      footer: "This link confirms the deposit and notifies your client automatically.",
    });

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ stylist_notified_at: new Date().toISOString() })
      .eq("id", booking_id);

    if (updateError) throw new Error(updateError.message);

    return new Response(JSON.stringify({ ok: true, booking_id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
