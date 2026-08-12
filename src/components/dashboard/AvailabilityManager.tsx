"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addBlockedTime,
  deleteBlockedTime,
  setAvailability,
  updateBookingSettings,
} from "@/lib/actions/business";
import {
  DEFAULT_CANCELLATION_POLICY,
  formatDisplayDate,
  rowsToSchedule,
  scheduleToRows,
  type DayAvailability,
} from "@/lib/salon-helpers";
import { AvailabilityEditor } from "@/components/availability/AvailabilityEditor";
import { BookingSettingsFields } from "@/components/availability/BookingSettingsFields";
import type { Availability, BlockedTime } from "@/types/database";

export function AvailabilityManager({
  businessId,
  initialAvailability,
  initialBlocked,
  initialNoticeHours,
  initialCancellationPolicy,
}: {
  businessId: string;
  initialAvailability: Availability[];
  initialBlocked: BlockedTime[];
  initialNoticeHours: number;
  initialCancellationPolicy: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [schedule, setSchedule] = useState<DayAvailability[]>(() =>
    rowsToSchedule(initialAvailability)
  );
  const [noticeHours, setNoticeHours] = useState(initialNoticeHours ?? 24);
  const [cancellationPolicy, setCancellationPolicy] = useState(
    initialCancellationPolicy || DEFAULT_CANCELLATION_POLICY
  );

  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [wholeDay, setWholeDay] = useState(true);

  function saveHours(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const rows = scheduleToRows(schedule);
    startTransition(async () => {
      try {
        await setAvailability(businessId, rows);
        await updateBookingSettings({
          business_id: businessId,
          minimum_booking_notice_hours: noticeHours,
          cancellation_policy: cancellationPolicy,
        });
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save");
      }
    });
  }

  function addBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockDate) {
      setError("Choose a date to block.");
      return;
    }
    if (!wholeDay && (!blockStart || !blockEnd)) {
      setError("Set start and end time, or block the whole day.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await addBlockedTime({
          business_id: businessId,
          date: blockDate,
          start_time: wholeDay ? null : blockStart,
          end_time: wholeDay ? null : blockEnd,
          reason: blockReason || (wholeDay ? "Holiday" : "Unavailable"),
        });
        setBlockDate("");
        setBlockStart("");
        setBlockEnd("");
        setBlockReason("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not block time");
      }
    });
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl text-[#1A1614]">Availability</h1>
        <p className="mt-2 text-sm text-[#6B5E58]">
          Your working hours, blocked time, and how much notice clients need.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Saved.
        </p>
      )}

      <form
        onSubmit={saveHours}
        className="space-y-8 rounded-3xl bg-white p-8 ring-1 ring-[#1A1614]/5"
      >
        <AvailabilityEditor schedule={schedule} onChange={setSchedule} />
        <BookingSettingsFields
          noticeHours={noticeHours}
          cancellationPolicy={cancellationPolicy}
          onNoticeChange={setNoticeHours}
          onPolicyChange={setCancellationPolicy}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#1A1614] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save availability"}
        </button>
      </form>

      <section className="rounded-3xl bg-white p-8 ring-1 ring-[#1A1614]/5">
        <h2 className="font-serif text-2xl text-[#1A1614]">Block time</h2>
        <p className="mt-1 text-sm text-[#6B5E58]">
          Holidays, lunch, or any hours that should not be bookable.
        </p>

        <form onSubmit={addBlock} className="mt-6 space-y-4">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={wholeDay}
              onChange={(e) => setWholeDay(e.target.checked)}
              className="h-4 w-4 accent-[#B8956E]"
            />
            Block the entire day
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Reason (Holiday, Lunch…)"
              className="rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
            />
          </div>
          {!wholeDay && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="time"
                value={blockStart}
                onChange={(e) => setBlockStart(e.target.value)}
                className="rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
              />
              <span className="text-[#9C8E86]">–</span>
              <input
                type="time"
                value={blockEnd}
                onChange={(e) => setBlockEnd(e.target.value)}
                className="rounded-xl border border-[#E8E0D8] px-3 py-2 text-sm"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full border border-[#1A1614] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A1614] disabled:opacity-40"
          >
            Block time
          </button>
        </form>

        <ul className="mt-8 divide-y divide-[#E8E0D8]">
          {initialBlocked.length === 0 && (
            <li className="py-4 text-sm text-[#9C8E86]">No blocked times yet.</li>
          )}
          {initialBlocked.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"
            >
              <div>
                <p className="font-medium text-[#1A1614]">
                  {formatDisplayDate(b.date)}
                  {b.start_time && b.end_time
                    ? ` · ${String(b.start_time).slice(0, 5)}–${String(b.end_time).slice(0, 5)}`
                    : " · All day"}
                </p>
                {b.reason && (
                  <p className="text-[#9C8E86]">{b.reason}</p>
                )}
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteBlockedTime(b.id);
                    router.refresh();
                  })
                }
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
