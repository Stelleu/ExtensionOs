"use client";

import { BrowserFrame } from "./BrowserFrame";

/** Miniature booking UI — styling lifted from the real booking flow. */
export function BookingDemoMock({ step }: { step: "service" | "datetime" | "confirm" }) {
  return (
    <BrowserFrame url="luxe.extensions/book">
      <div className="p-4 text-[#1A1614] sm:p-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#B8956E]">
          Book your glam
        </p>
        <h4 className="mt-2 font-serif text-lg text-[#1A1614]">Secure your slot</h4>

        {step === "service" && (
          <div className="mt-4 space-y-2">
            {[
              { name: "Tape-In Extensions", price: "£250", dur: "3 hrs" },
              { name: "Maintenance Move-Up", price: "£80", dur: "90 min" },
            ].map((s, i) => (
              <div
                key={s.name}
                className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                  i === 0
                    ? "border-[#B8956E]/50 bg-[#FAF8F5] ring-2 ring-[#B8956E]/20"
                    : "border-[#E8E0D8] bg-white"
                }`}
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-[10px] text-[#9C8E86]">{s.dur}</p>
                </div>
                <p className="font-serif text-sm">{s.price}</p>
              </div>
            ))}
          </div>
        )}

        {step === "datetime" && (
          <div className="mt-4">
            <p className="text-xs font-medium text-[#1A1614]">March 2026</p>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
              {["M", "T", "W", "TH", "F", "SA", "SU"].map((d) => (
                <span key={d} className="text-[#9C8E86]">
                  {d}
                </span>
              ))}
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const selected = day === 14;
                const disabled = day < 10;
                return (
                  <span
                    key={day}
                    className={`flex aspect-square items-center justify-center rounded-lg ${
                      selected
                        ? "bg-[#1A1614] font-semibold text-white"
                        : disabled
                          ? "text-[#D4CCC4]"
                          : "text-[#1A1614]"
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {["10:00", "13:30", "16:00"].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-lg py-2 text-center text-[10px] font-medium ${
                    i === 1
                      ? "bg-[#1A1614] text-white"
                      : "border border-[#E8E0D8] bg-white"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="mt-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9]">
              <svg className="h-6 w-6 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-3 font-serif text-base">You&apos;re all set!</p>
            <p className="mt-1 text-[10px] text-[#6B5E58]">
              Tape-In · 14 Mar · 13:30
            </p>
            <div className="mt-4 rounded-xl bg-[#FAF8F5] p-3">
              <p className="text-[9px] uppercase tracking-wider text-[#9C8E86]">
                Deposit
              </p>
              <p className="font-serif text-xl text-[#B8956E]">£50</p>
            </div>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}