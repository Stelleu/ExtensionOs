import { createServiceClient } from "../_shared/supabase.ts";
import { sendTemplatedEmail } from "../_shared/email.ts";
import { todayIsoDate } from "../_shared/format.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type BookingRow = {
  id: string;
  maintenance_due_date: string;
  businesses: { name: string; maintenance_reminder_days_before: number } | null;
  clients: { name: string; email: string | null } | null;
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
    const supabase = createServiceClient();
    const today = todayIsoDate();

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        maintenance_due_date,
        businesses ( name, maintenance_reminder_days_before ),
        clients ( name, email )
      `
      )
      .eq("status", "completed")
      .eq("maintenance_reminder_sent", false)
      .not("maintenance_due_date", "is", null)
      .gte("maintenance_due_date", today);

    if (error) throw new Error(error.message);

    let remindersSent = 0;

    for (const row of (data ?? []) as BookingRow[]) {
      const dueDate = String(row.maintenance_due_date);
      const daysBefore = row.businesses?.maintenance_reminder_days_before ?? 3;
      const reminderStart = shiftIsoDate(dueDate, -daysBefore);

      if (today < reminderStart || today > dueDate) continue;

      const clientEmail = row.clients?.email;
      if (!clientEmail) continue;

      await sendTemplatedEmail({
        to: clientEmail,
        subject: "Time for your maintenance appointment",
        title: "Time for your maintenance appointment",
        intro: `Hi ${row.clients?.name ?? "there"}, it's been about six weeks since your last visit at ${row.businesses?.name ?? "your salon"}. Your extensions will look their best with a maintenance appointment soon.`,
        footer:
          "Reply to your stylist or book online to schedule your next maintenance slot.",
      });

      const { error: updateError } = await supabase
        .from("bookings")
        .update({ maintenance_reminder_sent: true })
        .eq("id", row.id);

      if (updateError) throw new Error(updateError.message);
      remindersSent += 1;
    }

    return new Response(JSON.stringify({ reminders_sent: remindersSent }), {
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

function shiftIsoDate(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
