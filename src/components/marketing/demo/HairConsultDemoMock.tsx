"use client";

import { BrowserFrame } from "./BrowserFrame";

const subtypes = ["2A", "3B", "4C"] as const;

function MiniHairIcon({ label, selected }: { label: string; selected: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[9px] ${
        selected
          ? "border-[#B8956E] bg-white ring-2 ring-[#B8956E]/20"
          : "border-[#E8E0D8] bg-white"
      }`}
    >
      <div
        className={`h-6 w-6 rounded-full ${
          selected ? "bg-[#B8956E]/30" : "bg-[#FAF8F5]"
        }`}
      />
      <span className="font-medium uppercase">{label}</span>
    </div>
  );
}

export function HairConsultDemoMock({
  phase,
}: {
  phase: "select" | "match";
}) {
  return (
    <BrowserFrame url="luxe.extensions/book" variant="phone">
      <div className="p-4 text-[#1A1614]">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#B8956E]">
          Your details
        </p>
        <p className="mt-2 text-xs font-medium">Tell us about your natural hair</p>

        {phase === "select" && (
          <div className="mt-3 space-y-3">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-[#9C8E86]">
              Curly family
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {subtypes.map((s) => (
                <MiniHairIcon key={s} label={s} selected={s === "3B"} />
              ))}
            </div>
            <div className="flex gap-2">
              {["Fine", "Medium", "Thick"].map((t) => (
                <span
                  key={t}
                  className={`flex-1 rounded-lg border py-2 text-center text-[9px] font-medium ${
                    t === "Medium"
                      ? "border-[#B8956E] bg-white"
                      : "border-[#E8E0D8]"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {phase === "match" && (
          <div className="mt-3 rounded-xl border border-[#B8956E]/30 bg-[#FAF8F5] p-3">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-[#B8956E]">
              Suggested match
            </p>
            <p className="mt-2 text-xs font-medium">18&quot; Body Wave · Medium</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br from-[#E8D5C4] to-[#B8956E] ${
                    n === 2 ? "ring-2 ring-[#B8956E]" : "opacity-60"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-[9px] text-[#6B5E58]">
              Based on 3B texture + medium density
            </p>
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}