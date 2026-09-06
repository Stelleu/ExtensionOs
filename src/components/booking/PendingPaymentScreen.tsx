"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { formatDisplayDate, formatSlotLabel } from "@/lib/salon-helpers";

interface PendingPaymentScreenProps {
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  depositAmount: number;
  paymentLinkUrl: string | null;
  salonSlug: string;
  instagram?: string | null;
  email?: string | null;
  phone?: string | null;
}

function instagramHandle(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  let value = raw.trim();
  value = value.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  value = value.replace(/\/.*$/, "");
  value = value.replace(/^@/, "");
  return value || null;
}

function contactLine(input: {
  instagram?: string | null;
  email?: string | null;
  phone?: string | null;
}): string | null {
  const handle = instagramHandle(input.instagram);
  if (handle) return `reach us on Instagram @${handle}.`;
  if (input.email?.trim()) return `reach us at ${input.email.trim()}.`;
  if (input.phone?.trim()) return `reach us on ${input.phone.trim()}.`;
  return null;
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E8E0D8] pb-4">
      <dt className="text-sm text-[#9C8E86]">{label}</dt>
      <dd
        className={`text-sm font-medium ${highlight ? "font-serif text-lg text-[#B8956E]" : "text-[#1A1614]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function PendingPaymentScreen({
  serviceName,
  appointmentDate,
  appointmentTime,
  depositAmount,
  paymentLinkUrl,
  salonSlug,
  instagram,
  email,
  phone,
}: PendingPaymentScreenProps) {
  const [clickedPay, setClickedPay] = useState(false);
  const followUp = contactLine({ instagram, email, phone });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-6 py-16">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_8px_60px_-12px_rgba(26,22,20,0.12)] ring-1 ring-[#1A1614]/5">
        <div className="border-b border-[#E8E0D8] bg-[#FAF8F5]/60 px-8 py-10 text-center lg:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8ED] ring-1 ring-[#B8956E]/20">
            <span className="font-serif text-2xl text-[#B8956E]" aria-hidden>
              ◷
            </span>
          </div>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#B8956E]">
            Almost there
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[#1A1614] sm:text-4xl">
            Your appointment is pending
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-[#6B5E58]">
            Pay your deposit to secure your slot. Your booking is reserved while
            your stylist confirms payment.
          </p>
        </div>

        <div className="space-y-8 px-8 py-10 lg:px-10">
          <dl className="space-y-5">
            <SummaryRow label="Service" value={serviceName} />
            <SummaryRow
              label="Date"
              value={formatDisplayDate(appointmentDate)}
            />
            <SummaryRow
              label="Time"
              value={formatSlotLabel(appointmentTime)}
            />
            <SummaryRow
              label="Deposit due"
              value={formatPrice(depositAmount)}
              highlight
            />
          </dl>

          {paymentLinkUrl ? (
            <a
              href={paymentLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setClickedPay(true)}
              className="block w-full rounded-full bg-[#1A1614] py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#2C2420]"
            >
              Pay your deposit
            </a>
          ) : (
            <p className="rounded-2xl bg-[#FAF8F5] px-4 py-3 text-center text-sm text-[#6B5E58]">
              Your stylist will share payment details with you shortly.
            </p>
          )}

          {clickedPay && (
            <p className="text-center text-sm leading-relaxed text-[#6B5E58]">
              Payment sent? You&apos;ll receive your confirmation by email
              shortly.
              {followUp ? ` If you don\u2019t hear back within a few hours, ${followUp}` : ""}
            </p>
          )}

          {!clickedPay && (
            <p className="text-center text-sm text-[#6B5E58]">
              You&apos;ll receive an email as soon as your appointment is
              confirmed.
            </p>
          )}

          <div className="text-center">
            <Link
              href={`/${salonSlug}`}
              className="text-sm text-[#B8956E] hover:underline"
            >
              Back to salon page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
