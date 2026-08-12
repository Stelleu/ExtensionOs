import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDisplayDate, formatSlotLabel } from "@/lib/salon-helpers";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string; slug?: string }>;
}) {
  const { booking_id, slug } = await searchParams;

  let summary: {
    service?: string;
    date?: string;
    time?: string;
    status?: string;
  } = {};

  if (booking_id) {
    try {
      const admin = createAdminClient();
      const { data } = await admin
        .from("bookings")
        .select("appointment_date, appointment_time, status, services(name)")
        .eq("id", booking_id)
        .maybeSingle();
      if (data) {
        const svc = data.services as unknown as { name: string } | null;
        summary = {
          service: svc?.name,
          date: data.appointment_date,
          time: String(data.appointment_time).slice(0, 5),
          status: data.status,
        };
      }
    } catch {
      // env may not be configured yet
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-[#1A1614]/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9] text-2xl text-[#2E7D32]">
          ✓
        </div>
        <h1 className="mt-6 font-serif text-3xl text-[#1A1614]">
          Booking confirmed
        </h1>
        {summary.service && summary.date && summary.time ? (
          <p className="mt-4 text-sm text-[#6B5E58]">
            {summary.service} on {formatDisplayDate(summary.date)} at{" "}
            {formatSlotLabel(summary.time)}.
            {summary.status === "pending_payment"
              ? " Waiting for payment confirmation…"
              : " See you soon!"}
          </p>
        ) : (
          <p className="mt-4 text-sm text-[#6B5E58]">
            Thank you — your deposit has been received.
          </p>
        )}
        {slug && (
          <Link
            href={`/${slug}`}
            className="mt-8 inline-block text-sm text-[#B8956E] hover:underline"
          >
            Back to salon page
          </Link>
        )}
      </div>
    </div>
  );
}
