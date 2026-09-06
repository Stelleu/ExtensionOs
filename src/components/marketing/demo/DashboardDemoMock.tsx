"use client";

import { BrowserFrame } from "./BrowserFrame";

export function DashboardDemoMock() {
  return (
    <BrowserFrame url="app.extensionos.com/dashboard">
      <div className="bg-[#FAF8F5] p-4 text-[#1A1614]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#B8956E]">
          Today&apos;s appointments
        </p>

        <article className="mt-3 rounded-xl border border-[#E8E0D8] bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-serif text-sm">Amara K.</p>
              <p className="mt-0.5 text-[10px] text-[#6B5E58]">
                14 Mar · 13:30
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
              Confirmed
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[9px] text-[#6B5E58]">
              Tape-In Extensions
            </span>
            <span className="rounded-full border border-[#B8956E]/30 px-2 py-0.5 text-[9px] text-[#B8956E]">
              Returning · 3 visits
            </span>
          </div>

          <div className="mt-3 rounded-lg border border-[#E8E0D8] bg-[#FAF8F5]/50 p-3">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-[#9C8E86]">
              Natural hair profile
            </p>
            <p className="mt-1 text-[10px] text-[#1A1614]">
              3B · Medium · No recent chemical treatment
            </p>
            <p className="mt-1 text-[9px] text-[#6B5E58]">
              Suggested: 18&quot; body wave, medium density
            </p>
          </div>

          <div className="mt-3 border-t border-[#E8E0D8] pt-3">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-[#9C8E86]">
              Visit history
            </p>
            <ul className="mt-1.5 space-y-1 text-[9px] text-[#6B5E58]">
              <li>Jan 2026 — Maintenance move-up</li>
              <li>Nov 2025 — Full tape-in install</li>
            </ul>
          </div>
        </article>
      </div>
    </BrowserFrame>
  );
}
