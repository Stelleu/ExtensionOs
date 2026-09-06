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
      brandedPage({
        title: "Method not allowed",
        message: "Use the link from your email.",
      }),
      405
    );
  }

  const token = extractPathToken(req, "cancel-booking");
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

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        status,
        appointment_date,
        appointment_time,
        businesses ( name, email, phone, cancellation_cutoff_hours ),
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

    if (booking.status === "cancelled" || booking.status === "completed") {
      return htmlResponse(
        brandedPage({
          title: "Cannot cancel",
          message: "This booking can no longer be cancelled here.",
        }),
        409
      );
    }

    const business = booking.businesses as {
      name: string;
      email: string | null;
      phone: string | null;
      cancellation_cutoff_hours: number | null;
    } | null;
    const client = booking.clients as { name: string; email: string | null } | null;
    const service = booking.services as { name: string } | null;
    const timeRaw = String(booking.appointment_time);
    const time = timeRaw.length >= 8 ? timeRaw.slice(0, 8) : `${timeRaw.slice(0, 5)}:00`;
    const appointmentAt = new Date(`${booking.appointment_date}T${time}`);
    const cutoffHours = business?.cancellation_cutoff_hours ?? 24;
    const tooClose =
      Number.isNaN(appointmentAt.getTime()) ||
      Date.now() > appointmentAt.getTime() - cutoffHours * 60 * 60 * 1000;

    if (tooClose) {
      const contact = [business?.phone, business?.email]
        .filter((v): v is string => !!v?.trim())
        .join(" or ");
      return htmlResponse(
        brandedPage({
          title: "Too close to cancel",
          message: contact
            ? `This appointment is too close to cancel automatically — please contact ${contact} directly.`
            : "This appointment is too close to cancel automatically — please contact the salon directly.",
        }),
        403
      );
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_reason: "client_requested",
      })
      .eq("id", booking.id);

    if (updateError) throw new Error(updateError.message);

    if (business?.email) {
      const apptTime = String(booking.appointment_time).slice(0, 5);
      await sendTemplatedEmail({
        to: business.email,
        subject: `Cancelled — ${client?.name ?? "Client"}`,
        title: "A client cancelled",
        intro: `${client?.name ?? "A client"} cancelled their appointment.`,
        rows: [
          { label: "Service", value: service?.name ?? "—" },
          {
            label: "Date",
            value: formatDisplayDate(String(booking.appointment_date)),
          },
          { label: "Time", value: formatSlotLabel(apptTime) },
        ],
        footer: "This slot is now free for someone else to book.",
      });
    }

    return htmlResponse(
      brandedPage({
        title: "Appointment cancelled",
        message: "Your appointment has been cancelled.",
      })
    );
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
