"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { SalonProfile } from "@/types/salon";

interface HeaderProps {
  salon: SalonProfile;
}

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#book", label: "Book" },
];

export function Header({ salon }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF8F5]/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(26,22,20,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="#" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A1614] font-serif text-sm font-medium tracking-widest text-[#FAF8F5] transition-transform group-hover:scale-105">
            {salon.logoInitials}
          </div>
          <span className="hidden font-serif text-xl tracking-tight text-[#1A1614] sm:block">
            {salon.businessName}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#6B5E58] transition-colors hover:text-[#1A1614]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#book"
            className="rounded-full bg-[#1A1614] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-all hover:bg-[#B8956E] hover:shadow-lg"
          >
            Book Now
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="relative h-8 w-8 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`absolute left-1/2 top-2 block h-0.5 w-5 -translate-x-1/2 bg-[#1A1614] transition-all ${menuOpen ? "top-4 rotate-45" : ""}`} />
          <span className={`absolute left-1/2 top-4 block h-0.5 w-5 -translate-x-1/2 bg-[#1A1614] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`absolute left-1/2 top-6 block h-0.5 w-5 -translate-x-1/2 bg-[#1A1614] transition-all ${menuOpen ? "top-4 -rotate-45" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#E8E0D8] bg-[#FAF8F5]/98 px-6 py-8 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-[#6B5E58]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-[#1A1614] py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Book Now
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
