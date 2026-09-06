import Link from "next/link";
import { formatDisplayDate, formatSlotLabel } from "@/lib/salon-helpers";

interface BookingConfirmedScreenProps {
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  businessName: string;
  salonSlug?: string;
}

export function BookingConfirmedScreen({
  serviceName,
  appointmentDate,
  appointmentTime,
  businessName,
  salonSlug,
}: BookingConfirmedScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-6 py-16">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_8px_60px_-12px_rgba(26,22,20,0.12)] ring-1 ring-[#1A1614]/5">
        <div className="border-b border-[#E8E0D8] bg-[#FAF8F5]/60 px-8 py-10 text-center lg:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9] text-2xl text-[#2E7D32]">
            ✓
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#B8956E]">
            Confirmed
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[#1A1614] sm:text-4xl">
            Your appointment is confirmed!
          </h1>
        </div>

        <div className="space-y-8 px-8 py-10 text-center lg:px-10">
          <p className="text-sm leading-relaxed text-[#6B5E58]">
            <span className="font-medium text-[#1A1614]">{serviceName}</span> on{" "}
            {formatDisplayDate(appointmentDate)} at{" "}
            {formatSlotLabel(appointmentTime)} with{" "}
            <span className="font-medium text-[#1A1614]">{businessName}</span>
          </p>

          <p className="text-sm text-[#9C8E86]">
            We look forward to seeing you. If you need to reschedule, contact
            your stylist directly.
          </p>

          {salonSlug && (
            <Link
              href={`/${salonSlug}`}
              className="inline-block text-sm text-[#B8956E] hover:underline"
            >
              Back to salon page
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
