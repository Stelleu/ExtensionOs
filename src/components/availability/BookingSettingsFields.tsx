"use client";

import { NOTICE_HOUR_OPTIONS } from "@/lib/salon-helpers";

interface BookingSettingsFieldsProps {
  noticeHours: number;
  cancellationPolicy: string;
  onNoticeChange: (hours: number) => void;
  onPolicyChange: (policy: string) => void;
}

export function BookingSettingsFields({
  noticeHours,
  cancellationPolicy,
  onNoticeChange,
  onPolicyChange,
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
          This is your business policy, shown on your public page. It is not
          legal advice.
        </p>
      </label>
    </div>
  );
}
