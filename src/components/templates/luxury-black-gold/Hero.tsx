import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface HeroProps {
  salon: SalonProfile;
}

export function Hero({ salon }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-28 lg:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-24">
        {/* Copy */}
        <div className="order-2 lg:order-1 lg:py-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#E8E0D8] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#B8956E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8956E]" />
            {salon.city} · Extension Specialist
          </p>

          <h1 className="mt-8 font-serif text-[2.75rem] leading-[1.05] tracking-tight text-[#1A1614] sm:text-6xl lg:text-[4.25rem]">
            Hair that makes you feel{" "}
            <span className="italic text-[#B8956E]">that</span> girl
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#6B5E58]">
            {salon.tagline}. Custom-blended extensions for a seamless, natural
            finish — because your hair is part of your lifestyle.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#book"
              className="inline-flex items-center justify-center rounded-full bg-[#1A1614] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#B8956E] hover:shadow-xl"
            >
              Book your appointment
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#6B5E58] transition-colors hover:text-[#1A1614]"
            >
              See the transformations
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="mt-14 flex gap-10 border-t border-[#E8E0D8] pt-8">
            <Stat value="500+" label="Queens served" />
            <Stat value="5.0" label="Star rating" />
            <Stat value="6–8 wks" label="Maintenance cycle" />
          </div>
        </div>

        {/* Image collage — airy, editorial */}
        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_24px_80px_-20px_rgba(26,22,20,0.25)]">
            <Image
              src={salon.heroImage}
              alt={salon.businessName}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Floating accent card */}
          <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-[#1A1614]/5 sm:-left-8 lg:-left-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9C8E86]">
              Next available
            </p>
            <p className="mt-1 font-serif text-xl text-[#1A1614]">This week</p>
            <a href="#book" className="mt-2 inline-block text-xs font-medium text-[#B8956E] hover:underline">
              Check slots →
            </a>
          </div>
          {/* Decorative blob */}
          <div className="absolute -right-8 -top-8 -z-10 h-40 w-40 rounded-full bg-[#E8D5C4]/40 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-2xl text-[#1A1614]">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#9C8E86]">{label}</p>
    </div>
  );
}
