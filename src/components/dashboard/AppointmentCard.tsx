"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Client, Service } from "@/types/database";
import { formatPrice } from "@/lib/format";
import { formatDisplayDate, formatSlotLabel } from "@/lib/salon-helpers";
import { updateBookingStatus } from "@/lib/actions/business";

export type AppointmentCardBooking = Booking & {
  clients: Pick<
    Client,
    "id" | "name" | "visit_count" | "health_notes" | "health_notes_consent" | "image_consent"
  > | null;
  services: Pick<Service, "id" | "name"> | null;
};

interface AppointmentCardProps {
  booking: AppointmentCardBooking;
}

export function AppointmentCard({ booking }: AppointmentCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const client = booking.clients;
  const service = booking.services;
  const isReturning = (client?.visit_count ?? 0) > 0;
  const loyaltyTier =
    (client?.visit_count ?? 0) >= 10
      ? "VIP"
      : (client?.visit_count ?? 0) >= 5
        ? "Loyal"
        : (client?.visit_count ?? 0) >= 1
          ? "Returning"
          : null;

  function setStatus(status: "completed" | "no_show" | "cancelled") {
    startTransition(async () => {
      await updateBookingStatus(booking.id, status);
      router.refresh();
    });
  }

  return (
    <article className="rounded-2xl border border-[#E8E0D8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xl text-[#1A1614]">
            {client?.name ?? "Client"}
          </p>
          <p className="mt-1 text-sm text-[#6B5E58]">
            {formatDisplayDate(booking.appointment_date)} ·{" "}
            {formatSlotLabel(String(booking.appointment_time).slice(0, 5))}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#FAF8F5] px-3 py-1 text-xs text-[#6B5E58]">
          {service?.name ?? "Service"}
        </span>
        {booking.wants_hair_addon && (
          <span className="rounded-full border border-[#B8956E]/30 px-3 py-1 text-xs text-[#B8956E]">
            Hair addon {booking.hair_length} {booking.hair_texture}
          </span>
        )}
        {isReturning && (
          <span className="rounded-full bg-[#1A1614] px-3 py-1 text-xs text-white">
            Returning client
          </span>
        )}
        {loyaltyTier && (
          <span className="rounded-full bg-[#B8956E] px-3 py-1 text-xs text-white">
            {loyaltyTier} · {client?.visit_count} visits
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-[#9C8E86]">
        Snapshot total {formatPrice(Number(booking.total_price))} · deposit{" "}
        {formatPrice(Number(booking.deposit_amount))}
        {booking.deposit_paid ? " (paid)" : " (unpaid)"}
      </p>

      {client?.health_notes_consent && client.health_notes && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="text-[10px] font-semibold uppercase tracking-wider">
            Health note
          </p>
          <p className="mt-1">{client.health_notes}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            client?.image_consent
              ? "bg-emerald-100 text-emerald-800"
              : "bg-[#FAF8F5] text-[#9C8E86]"
          }`}
        >
          Image use: {client?.image_consent ? "allowed" : "not allowed"}
        </span>
      </div>

      {(booking.status === "confirmed" ||
        booking.status === "pending_payment") && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("completed")}
            className="rounded-full bg-[#1A1614] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white disabled:opacity-50"
          >
            Mark completed
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("no_show")}
            className="rounded-full border border-[#E8E0D8] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B5E58] disabled:opacity-50"
          >
            No-show
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setStatus("cancelled")}
            className="rounded-full border border-[#E8E0D8] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B5E58] disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending_payment: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-slate-100 text-slate-700",
    cancelled: "bg-red-100 text-red-700",
    no_show: "bg-orange-100 text-orange-800",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${styles[status] ?? "bg-gray-100"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
