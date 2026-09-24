import { createServiceClient } from "../_shared/supabase.ts";
import { sendTemplatedEmail } from "../_shared/email.ts";
import { corsHeaders, jsonResponse } from "../_shared/http.ts";
import {
  formatDisplayDate,
  formatPrice,
  formatSlotLabel,
} from "../_shared/format.ts";

type ReminderRow = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  deposit_amount: number;
  confirmation_token: string | null;
  stylist_notified_at: string;
  confirmation_deadline: string;
  businesses: { name: string; email: string | null } | null;
  clients: { name: string } | null;
  services: { name: string } | null;
};

function isPastMidWindow(notifiedAt: string, deadline: string, nowMs: number): boolean {
  const notified = new Date(notifiedAt).getTime();
  const ends = new Date(deadline).getTime();
  if (!Number.isFinite(notified) || !Number.isFinite(ends) || ends <= notified) {
    return false;
  }
  if (nowMs >= ends) return false; // expired — leave for expire-pending-bookings
  const midpoint = notified + (ends - notified) / 2;
  return nowMs >= midpoint;
}

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
    const nowMs = Date.now();

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        appointment_date,
        appointment_time,
        deposit_amount,
        confirmation_token,
        stylist_notified_at,
        confirmation_deadline,
        businesses ( name, email ),
        clients ( name ),
        services ( name )
      `
      )
      .eq("status", "pending_payment")
      .eq("reminder_sent", false)
      .not("stylist_notified_at", "is", null)
      .gt("confirmation_deadline", new Date(nowMs).toISOString());

    if (error) throw new Error(error.message);

    let remindersSent = 0;
    let skipped = 0;
    const failures: { id: string; error: string }[] = [];

    for (const row of (data ?? []) as ReminderRow[]) {
      if (
        !isPastMidWindow(
          row.stylist_notified_at,
          row.confirmation_deadline,
          nowMs
        )
      ) {
        skipped += 1;
        continue;
      }

      const businessEmail = row.businesses?.email;
      if (!businessEmail || !row.confirmation_token) {
        skipped += 1;
        continue;
      }

      const time = String(row.appointment_time).slice(0, 5);
      const confirmUrl = `${siteUrl}/confirm-booking/${row.confirmation_token}`;
      const clientName = row.clients?.name ?? "Client";

      try {
        await sendTemplatedEmail({
          to: businessEmail,
          subject: `Reminder: confirm deposit for ${clientName}`,
          title: "Reminder — confirm deposit",
          intro: `${clientName}'s booking for ${row.services?.name ?? "a service"} is still waiting on deposit confirmation. Please confirm once you've received it.`,
          rows: [
            { label: "Service", value: row.services?.name ?? "—" },
            {
              label: "Date",
              value: formatDisplayDate(String(row.appointment_date)),
            },
            { label: "Time", value: formatSlotLabel(time) },
            {
              label: "Deposit",
              value: formatPrice(Number(row.deposit_amount)),
            },
          ],
          ctaUrl: confirmUrl,
          ctaLabel: "Confirm deposit received",
          footer:
            "This link confirms the deposit and notifies your client automatically.",
        });

        const { error: updateError } = await supabase
          .from("bookings")
          .update({ reminder_sent: true })
          .eq("id", row.id)
          .eq("status", "pending_payment")
          .eq("reminder_sent", false);

        if (updateError) throw new Error(updateError.message);
        remindersSent += 1;
      } catch (emailErr) {
        const message =
          emailErr instanceof Error ? emailErr.message : String(emailErr);
        console.error("notify-stylist-reminder failed", row.id, message);
        failures.push({ id: row.id, error: message });
      }
    }

    return jsonResponse({
      ok: true,
      reminders_sent: remindersSent,
      skipped,
      candidates: (data ?? []).length,
      failures,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return jsonResponse({ error: message }, 500);
  }
});
