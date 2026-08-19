import Link from "next/link";
import { PendingPaymentScreen } from "@/components/booking/PendingPaymentScreen";
import { BookingConfirmedScreen } from "@/components/booking/BookingConfirmedScreen";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string; slug?: string }>;
}) {
  const { booking_id, slug } = await searchParams;

  if (booking_id) {
    try {
      const admin = createAdminClient();
      const { data } = await admin
        .from("bookings")
        .select(
          "appointment_date, appointment_time, status, deposit_amount, services(name), businesses(payment_link_url, slug, name, instagram, email, phone)"
        )
        .eq("id", booking_id)
        .maybeSingle();

      if (data) {
        const svc = data.services as unknown as { name: string } | null;
        const biz = data.businesses as unknown as {
          payment_link_url: string | null;
          slug: string;
          name: string;
          instagram: string | null;
          email: string | null;
          phone: string | null;
        } | null;
        const salonSlug = slug || biz?.slug || "";
        const time = String(data.appointment_time).slice(0, 5);

        if (data.status === "pending_payment" && svc?.name) {
          return (
            <PendingPaymentScreen
              serviceName={svc.name}
              appointmentDate={data.appointment_date}
              appointmentTime={time}
              depositAmount={Number(data.deposit_amount)}
              paymentLinkUrl={biz?.payment_link_url ?? null}
              salonSlug={salonSlug}
              instagram={biz?.instagram}
              email={biz?.email}
              phone={biz?.phone}
            />
          );
        }

        if (svc?.name && data.appointment_date && time) {
          return (
            <BookingConfirmedScreen
              serviceName={svc.name}
              appointmentDate={data.appointment_date}
              appointmentTime={time}
              businessName={biz?.name ?? "your stylist"}
              salonSlug={salonSlug}
            />
          );
        }
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
        <p className="mt-4 text-sm text-[#6B5E58]">
          Thank you — we&apos;ll see you soon.
        </p>
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
