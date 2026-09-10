import { createServiceClient } from "../_shared/supabase.ts";
import { sendTemplatedEmail } from "../_shared/email.ts";

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

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        status,
        businesses ( name, care_instructions ),
        clients ( name, email )
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

    if (booking.status !== "completed") {
      return new Response(
        JSON.stringify({ error: "Booking is not completed" }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const business = booking.businesses as {
      name: string;
      care_instructions: string | null;
    } | null;
    const client = booking.clients as {
      name: string;
      email: string | null;
    } | null;

    if (!client?.email) {
      return new Response(JSON.stringify({ error: "Client email missing" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const careText =
      business?.care_instructions?.trim() ||
      "Avoid oil-based products at the bonds, sleep with hair in a loose braid, and book maintenance every 6–8 weeks for best results.";

    await sendTemplatedEmail({
      to: client.email,
      subject: "Caring for your new look",
      title: "Caring for your new look",
      intro: `Hi ${client.name}, thank you for visiting ${business?.name ?? "your stylist"}. Here is how to care for your hair after your appointment.`,
      sections: [
        {
          heading: "Aftercare tips",
          body: careText,
        },
      ],
      footer:
        "This is general guidance your stylist can personalise aftercare at your next visit.",
    });

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
