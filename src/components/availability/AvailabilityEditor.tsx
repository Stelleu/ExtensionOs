"use client";

import {
  DAY_LABELS,
  DAY_ORDER,
  type DayAvailability,
} from "@/lib/salon-helpers";

interface AvailabilityEditorProps {
  schedule: DayAvailability[];
  onChange: (next: DayAvailability[]) => void;
}

export function AvailabilityEditor({
  schedule,
  onChange,
}: AvailabilityEditorProps) {
  function updateDay(day: number, patch: Partial<DayAvailability>) {
    onChange(
      schedule.map((d) => (d.day === day ? { ...d, ...patch } : d))
    );
  }

  function updateWindow(
    day: number,
    index: number,
    patch: { start?: string; end?: string }
  ) {
    onChange(
      schedule.map((d) => {
        if (d.day !== day) return d;
        return {
          ...d,
          windows: d.windows.map((w, i) =>
            i === index ? { ...w, ...patch } : w
          ),
        };
      })
    );
  }

  function addWindow(day: number) {
    onChange(
      schedule.map((d) => {
        if (d.day !== day) return d;
        const last = d.windows[d.windows.length - 1];
        return {
          ...d,
          windows: [
            ...d.windows,
            { start: last?.end || "14:00", end: "18:00" },
          ],
        };
      })
    );
  }

  function removeWindow(day: number, index: number) {
    onChange(
      schedule.map((d) => {
        if (d.day !== day) return d;
        const windows = d.windows.filter((_, i) => i !== index);
        return {
          ...d,
          windows: windows.length ? windows : [{ start: "10:00", end: "18:00" }],
        };
      })
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-serif text-2xl text-[#1A1614]">
          When are you available?
        </h2>
        <p className="mt-1 text-sm text-[#6B5E58]">
          Toggle a day on, then set your hours. Add a second window for a lunch
          break.
        </p>
      </div>

      {DAY_ORDER.map((day) => {
        const d = schedule.find((s) => s.day === day)!;
        return (
          <div
            key={day}
            className="rounded-xl border border-[#E8E0D8] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3 text-sm text-[#1A1614]">
                <input
                  type="checkbox"
                  checked={d.enabled}
                  onChange={(e) =>
                    updateDay(day, { enabled: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#B8956E]"
                />
                <span className="w-10 font-medium">{DAY_LABELS[day]}</span>
                <span className="text-xs uppercase tracking-wider text-[#9C8E86]">
                  {d.enabled ? "Available" : "Closed"}
                </span>
              </label>
            </div>

            {d.enabled && (
              <div className="mt-3 space-y-2">
                {d.windows.map((w, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      value={w.start}
                      onChange={(e) =>
                        updateWindow(day, i, { start: e.target.value })
                      }
                      className="rounded-lg border border-[#E8E0D8] px-2 py-1.5 text-sm"
                    />
                    <span className="text-[#9C8E86]">–</span>
                    <input
                      type="time"
                      value={w.end}
                      onChange={(e) =>
                        updateWindow(day, i, { end: e.target.value })
                      }
                      className="rounded-lg border border-[#E8E0D8] px-2 py-1.5 text-sm"
                    />
                    {d.windows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWindow(day, i)}
                        className="text-xs text-[#9C8E86] hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addWindow(day)}
                  className="text-xs font-medium uppercase tracking-wider text-[#B8956E] hover:underline"
                >
                  + Add another time
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
