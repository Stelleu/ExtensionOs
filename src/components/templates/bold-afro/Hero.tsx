import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface HeroProps {
  salon: SalonProfile;
}

/** Full-bleed image with business name as typographic art. */
export function Hero({ salon }: HeroProps) {
  const name = salon.businessName || "Studio";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#1B4332]">
      <div className="absolute inset-0">
        {salon.heroImage.startsWith("blob:") ||
        salon.heroImage.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={salon.heroImage}
            alt=""
            className="h-full w-full object-cover opacity-55"
          />
        ) : (
          <Image
            src={salon.heroImage}
            alt=""
            fill
            priority
            className="object-cover opacity-55"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332] via-[#1B4332]/50 to-[#C45C3E]/30" />
      </div>

      <div className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8A849]">
          {salon.city || "Hair studio"} · Book online
        </p>
        <h1 className="mt-4 max-w-[12ch] text-[clamp(2.75rem,12vw,8rem)] font-extrabold leading-[0.9] tracking-tight text-[#FFF8F0]">
          {name}
        </h1>
        {salon.tagline ? (
          <p className="mt-6 max-w-md text-base font-semibold text-[#FFF8F0]/90 sm:text-lg">
            {salon.tagline}
          </p>
        ) : null}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#book"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#E8A849] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1B4332] transition-transform hover:scale-[1.02]"
          >
            Book your slot
          </a>
          <a
            href="#services"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-[#FFF8F0]/50 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFF8F0] transition-colors hover:border-[#FFF8F0]"
          >
            See the menu
          </a>
        </div>
      </div>

      {/* Angled cut into next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[#FFF8F0] sm:h-16"
        style={{ clipPath: "polygon(0 100%, 100% 40%, 100% 100%, 0 100%)" }}
        aria-hidden
      />
    </section>
  );
}
