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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1B4332] shadow-lg"
          : "bg-[#1B4332]/95"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="#" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8A849] text-sm font-bold text-[#1B4332]">
            {salon.logoInitials}
          </div>
          <span className="hidden text-lg font-bold text-[#FFF8F0] sm:block">
            {salon.businessName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-[#FFF8F0]/70 transition-colors hover:text-[#E8A849]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#book"
            className="rounded-2xl bg-[#C45C3E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 hover:bg-[#D46A4A]"
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
          <span className={`absolute left-1/2 top-2 block h-0.5 w-5 -translate-x-1/2 bg-[#FFF8F0] transition-all ${menuOpen ? "top-4 rotate-45" : ""}`} />
          <span className={`absolute left-1/2 top-4 block h-0.5 w-5 -translate-x-1/2 bg-[#FFF8F0] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`absolute left-1/2 top-6 block h-0.5 w-5 -translate-x-1/2 bg-[#FFF8F0] transition-all ${menuOpen ? "top-4 -rotate-45" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#FFF8F0]/10 bg-[#1B4332] px-6 py-8 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-[#FFF8F0]/80"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-2xl bg-[#C45C3E] py-3 text-center text-xs font-bold uppercase tracking-wider text-white"
            >
              Book Now
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
