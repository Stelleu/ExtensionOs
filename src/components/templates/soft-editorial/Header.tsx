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
          ? "border-b border-[#E5DDD4] bg-[#FAF6F1]/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
        <Link href="#" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[#C9A897]/40 font-[family-name:var(--font-cormorant)] text-sm tracking-widest text-[#2C2825]">
            {salon.logoInitials}
          </div>
          <span className="hidden font-[family-name:var(--font-cormorant)] text-xl tracking-tight text-[#2C2825] sm:block">
            {salon.businessName}
          </span>
        </Link>

        <nav className="hidden items-center gap-12 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7A726A] transition-colors hover:text-[#C9A897]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#book"
            className="border border-[#2C2825] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-[#2C2825] transition-colors hover:border-[#C9A897] hover:text-[#C9A897]"
          >
            Book
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="relative h-8 w-8 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`absolute left-1/2 top-2 block h-px w-5 -translate-x-1/2 bg-[#2C2825] transition-all ${menuOpen ? "top-4 rotate-45" : ""}`} />
          <span className={`absolute left-1/2 top-4 block h-px w-5 -translate-x-1/2 bg-[#2C2825] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`absolute left-1/2 top-6 block h-px w-5 -translate-x-1/2 bg-[#2C2825] transition-all ${menuOpen ? "top-4 -rotate-45" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#E5DDD4] bg-[#FAF6F1] px-8 py-10 md:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm uppercase tracking-[0.15em] text-[#7A726A]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="mt-2 border border-[#2C2825] py-3 text-center text-xs uppercase tracking-[0.2em]"
            >
              Book appointment
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
