import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface HeroProps {
  salon: SalonProfile;
}

export function Hero({ salon }: HeroProps) {
  return (
    <section className="relative overflow-x-clip overflow-hidden bg-[#C45C3E] pt-24 lg:pt-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #FFF8F0 0, #FFF8F0 1px, transparent 1px, transparent 12px)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:pb-20">
        <div className="py-8 lg:py-12">
          <span className="inline-block rounded-full bg-[#1B4332] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8A849]">
            {salon.city} · Hair Studio
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#FFF8F0] sm:text-5xl lg:text-6xl">
            {salon.tagline || "Your crown deserves the spotlight"}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#FFF8F0]/85">
            Vibrant, healthy hair transformations rooted in expert care, bold
            colour, flawless installs, and confidence that lasts.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#book"
              className="inline-flex items-center justify-center rounded-2xl bg-[#E8A849] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#1B4332] transition-transform hover:scale-105"
            >
              Book your slot
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-[#FFF8F0]/40 px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#FFF8F0] transition-colors hover:border-[#FFF8F0]"
            >
              See the work
            </a>
          </div>
          <div className="mt-12 flex gap-8">
            <Stat value="500+" label="Clients" />
            <Stat value="5★" label="Rated" />
            <Stat value="6 wks" label="Maintenance" />
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-4 ring-[#E8A849]/40">
            {salon.heroImage.startsWith("blob:") ||
            salon.heroImage.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={salon.heroImage}
                alt={salon.businessName}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={salon.heroImage}
                alt={salon.businessName}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="absolute bottom-3 right-3 rounded-2xl bg-[#1B4332] px-5 py-3 shadow-xl sm:-bottom-4 sm:-right-4 sm:px-6 sm:py-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8A849]">
              Open slots
            </p>
            <p className="mt-1 text-lg font-bold text-[#FFF8F0]">This week</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-[#E8A849]">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#FFF8F0]/60">
        {label}
      </p>
    </div>
  );
}
