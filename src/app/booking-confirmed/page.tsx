import { BookingConfirmedScreen } from "@/components/booking/BookingConfirmedScreen";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>;
}) {
  const { booking_id } = await searchParams;

  if (booking_id) {
    try {
      const admin = createAdminClient();
      const { data } = await admin
        .from("bookings")
        .select(
          "appointment_date, appointment_time, services(name), businesses(slug, name)"
        )
        .eq("id", booking_id)
        .maybeSingle();

      if (data) {
        const svc = data.services as unknown as { name: string } | null;
        const biz = data.businesses as unknown as {
          slug: string;
          name: string;
        } | null;

        if (svc?.name && biz?.name) {
          return (
            <BookingConfirmedScreen
              serviceName={svc.name}
              appointmentDate={data.appointment_date}
              appointmentTime={String(data.appointment_time).slice(0, 5)}
              businessName={biz.name}
              salonSlug={biz.slug}
            />
          );
        }
      }
    } catch {
      // env may not be configured yet
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-[0_8px_60px_-12px_rgba(26,22,20,0.12)] ring-1 ring-[#1A1614]/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9] text-2xl text-[#2E7D32]">
          ✓
        </div>
        <h1 className="mt-6 font-serif text-3xl text-[#1A1614]">
          Your appointment is confirmed!
        </h1>
        <p className="mt-4 text-sm text-[#6B5E58]">
          Thank you — we look forward to seeing you.
        </p>
      </div>
    </div>
  );
}
