"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MARKETING_CONFIG } from "@/components/marketing/config";
import { GradientButton } from "@/components/marketing/GradientButton";

const nav = [
  { href: "/#demo", label: "Demo" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-[var(--mkt-bg)]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg marketing-gradient-bg text-[10px] font-bold text-[#0c0a0f]">
            EO
          </span>
          <span className="font-display text-lg tracking-tight text-[var(--mkt-text)]">
            {MARKETING_CONFIG.productName}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--mkt-text-muted)] transition-colors hover:text-[var(--mkt-accent-rose)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--mkt-text-muted)] transition-colors hover:text-[var(--mkt-text)]"
          >
            Sign in
          </Link>
          <GradientButton href={MARKETING_CONFIG.signupPath} className="!px-6 !py-2.5">
            Get started
          </GradientButton>
        </nav>

        <button
          type="button"
          aria-label="Menu"
          className="relative h-8 w-8 md:hidden"
          onClick={() => setOpen(!open)}
        >
          <span className={`absolute left-1/2 top-2 block h-px w-5 -translate-x-1/2 bg-[var(--mkt-text)] transition-all ${open ? "top-4 rotate-45" : ""}`} />
          <span className={`absolute left-1/2 top-4 block h-px w-5 -translate-x-1/2 bg-[var(--mkt-text)] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-1/2 top-6 block h-px w-5 -translate-x-1/2 bg-[var(--mkt-text)] transition-all ${open ? "top-4 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/5 bg-[var(--mkt-bg)]/95 px-6 py-8 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-wider text-[var(--mkt-text-muted)]"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="text-sm text-[var(--mkt-text-muted)]">
              Sign in
            </Link>
            <GradientButton href={MARKETING_CONFIG.signupPath}>
              {MARKETING_CONFIG.trialLabel}
            </GradientButton>
          </div>
        </nav>
      )}
    </header>
  );
}
