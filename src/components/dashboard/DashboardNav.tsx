"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

type NavLink = { href: string; label: string };

export function DashboardNav({ links }: { links: NavLink[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center justify-end border-t border-[#E8E0D8] px-4 py-2 md:hidden">
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="relative h-11 w-11"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            className={`absolute left-1/2 top-3 block h-0.5 w-5 -translate-x-1/2 bg-[#1A1614] transition-all ${
              menuOpen ? "top-[1.375rem] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-1/2 top-[1.375rem] block h-0.5 w-5 -translate-x-1/2 bg-[#1A1614] transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-1/2 top-[1.75rem] block h-0.5 w-5 -translate-x-1/2 bg-[#1A1614] transition-all ${
              menuOpen ? "top-[1.375rem] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-[#E8E0D8] bg-[#FAF8F5] px-6 py-6 md:hidden"
          aria-label="Dashboard"
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => {
              const active =
                l.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-3 py-3 text-sm uppercase tracking-[0.15em] ${
                    active
                      ? "bg-white font-semibold text-[#1A1614] ring-1 ring-[#1A1614]/5"
                      : "text-[#6B5E58]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <form action={signOut} className="mt-3 border-t border-[#E8E0D8] pt-3">
              <button
                type="submit"
                className="w-full rounded-xl px-3 py-3 text-left text-sm uppercase tracking-[0.15em] text-[#9C8E86]"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      )}

      <nav
        className="mx-auto hidden max-w-6xl flex-wrap gap-1 border-t border-[#E8E0D8] px-6 py-2 md:flex"
        aria-label="Dashboard"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#6B5E58] hover:bg-[#FAF8F5] hover:text-[#1A1614]"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
