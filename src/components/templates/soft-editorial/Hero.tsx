import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface HeroProps {
  salon: SalonProfile;
}

export function Hero({ salon }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 lg:pt-40">
      <div className="mx-auto max-w-6xl px-8 pb-20 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
            {salon.city}
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-[2.75rem] font-light leading-[1.1] tracking-tight text-[#2C2825] sm:text-6xl lg:text-7xl">
            {salon.tagline || salon.businessName}
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-[#7A726A]">
            Refined extension artistry with an editorial eye — effortless,
            natural, and unmistakably you.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href="#book"
              className="border-b border-[#C9A897] pb-1 text-[11px] font-medium uppercase tracking-[0.3em] text-[#2C2825] transition-colors hover:text-[#C9A897]"
            >
              Reserve your appointment
            </a>
            <span className="hidden h-px w-8 bg-[#E5DDD4] sm:block" />
            <a
              href="#gallery"
              className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#7A726A] transition-colors hover:text-[#2C2825]"
            >
              View portfolio
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="relative aspect-[16/10] overflow-hidden">
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
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            )}
          </div>
          <div className="absolute -bottom-px left-0 right-0 h-px bg-[#E5DDD4]" />
        </div>
      </div>
    </section>
  );
}
