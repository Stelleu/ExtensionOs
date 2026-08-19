"use client";

import {
  NOTICE_HOUR_OPTIONS,
  PAYMENT_CONFIRMATION_WINDOW_OPTIONS,
} from "@/lib/salon-helpers";

interface BookingSettingsFieldsProps {
  noticeHours: number;
  cancellationPolicy: string;
  paymentLinkUrl: string;
  confirmationWindowHours: number;
  onNoticeChange: (hours: number) => void;
  onPolicyChange: (policy: string) => void;
  onPaymentLinkChange: (url: string) => void;
  onConfirmationWindowChange: (hours: number) => void;
}

export function BookingSettingsFields({
  noticeHours,
  cancellationPolicy,
  paymentLinkUrl,
  confirmationWindowHours,
  onNoticeChange,
  onPolicyChange,
  onPaymentLinkChange,
  onConfirmationWindowChange,
}: BookingSettingsFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl text-[#1A1614]">Booking settings</h2>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
          Minimum booking notice
        </span>
        <select
          value={noticeHours}
          onChange={(e) => onNoticeChange(Number(e.target.value))}
          className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm outline-none focus:border-[#B8956E]"
        >
          {NOTICE_HOUR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
          Cancellation policy
        </span>
        <textarea
          value={cancellationPolicy}
          onChange={(e) => onPolicyChange(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm outline-none focus:border-[#B8956E]"
        />
        <p className="mt-2 text-xs text-[#9C8E86]">
          Your business policy, shown on your public page. This is not legal
          advice.
        </p>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
          Your payment link (Wise, PayPal.me, Revolut.me…)
        </span>
        <input
          type="url"
          value={paymentLinkUrl}
          onChange={(e) => onPaymentLinkChange(e.target.value)}
          placeholder="https://paypal.me/yoursalon"
          className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm outline-none focus:border-[#B8956E]"
        />
        <p className="mt-2 text-xs text-[#9C8E86]">
          Clients will be sent here to pay their deposit.
        </p>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#9C8E86]">
          Payment confirmation window
        </span>
        <select
          value={confirmationWindowHours}
          onChange={(e) => onConfirmationWindowChange(Number(e.target.value))}
          className="w-full rounded-xl border border-[#E8E0D8] px-4 py-3 text-sm outline-none focus:border-[#B8956E]"
        >
          {PAYMENT_CONFIRMATION_WINDOW_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-[#9C8E86]">
          How long clients&apos; bookings stay reserved while you confirm
          you&apos;ve received their deposit.
        </p>
      </label>
    </div>
  );
}
