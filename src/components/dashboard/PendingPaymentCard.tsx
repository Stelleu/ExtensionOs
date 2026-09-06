import type { Booking, Client, Service } from "@/types/database";
import { formatPrice } from "@/lib/format";
import {
  formatConfirmationDeadlineRemaining,
  formatDisplayDate,
  formatSlotLabel,
} from "@/lib/salon-helpers";

export type PendingPaymentBooking = Booking & {
  clients: Pick<Client, "id" | "name"> | null;
  services: Pick<Service, "id" | "name"> | null;
};

interface PendingPaymentCardProps {
  booking: PendingPaymentBooking;
}

export function PendingPaymentCard({ booking }: PendingPaymentCardProps) {
  const client = booking.clients;
  const service = booking.services;
  const time = String(booking.appointment_time).slice(0, 5);
  const { label: remainingLabel, isExpired } = formatConfirmationDeadlineRemaining(
    booking.confirmation_deadline
  );

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        isExpired ? "border-amber-300 bg-amber-50/30" : "border-[#E8E0D8]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xl text-[#1A1614]">
            {client?.name ?? "Client"}
          </p>
          <p className="mt-1 text-sm text-[#6B5E58]">
            {formatDisplayDate(booking.appointment_date)} ·{" "}
            {formatSlotLabel(time)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            isExpired
              ? "bg-amber-200 text-amber-900"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {remainingLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#FAF8F5] px-3 py-1 text-xs text-[#6B5E58]">
          {service?.name ?? "Service"}
        </span>
        <span className="rounded-full border border-[#B8956E]/30 px-3 py-1 text-xs text-[#B8956E]">
          Deposit {formatPrice(Number(booking.deposit_amount))}
        </span>
      </div>

      <p className="mt-4 text-xs text-[#9C8E86]">
        Awaiting deposit confirmation via your email link. The slot releases
        automatically once the confirmation window ends.
      </p>
    </article>
  );
}
