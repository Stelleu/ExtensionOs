import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface HeroProps {
  salon: SalonProfile;
}

/** Asymmetric split: full-bleed image | editorial copy. Stacks on mobile. */
export function Hero({ salon }: HeroProps) {
  return (
    <section className="relative min-h-[100svh] lg:min-h-screen">
      <div className="grid min-h-[100svh] lg:min-h-screen lg:grid-cols-2">
        <div className="relative order-1 aspect-[4/5] min-h-[55svh] lg:order-2 lg:aspect-auto lg:min-h-screen">
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

        <div className="order-2 flex flex-col justify-end px-4 pb-12 pt-28 sm:px-8 sm:pb-16 lg:order-1 lg:justify-center lg:px-12 lg:pb-24 lg:pt-32 xl:px-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C9A897]">
            {salon.city}
            {salon.city ? " · " : ""}
            {salon.businessName}
          </p>
          <h1 className="mt-6 max-w-md font-[family-name:var(--font-cormorant)] text-[2.75rem] font-light leading-[1.05] tracking-tight text-[#2C2825] sm:text-5xl lg:text-6xl xl:text-7xl">
            {salon.tagline || "Hair, edited for you"}
          </h1>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-[#7A726A] sm:text-base">
            Refined extension artistry with an editorial eye — effortless,
            natural, and unmistakably you.
          </p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <a
              href="#book"
              className="inline-flex min-h-11 items-center border-b border-[#C9A897] pb-1 text-[11px] font-medium uppercase tracking-[0.28em] text-[#2C2825] transition-colors hover:text-[#C9A897]"
            >
              Reserve
            </a>
            <a
              href="#services"
              className="inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.28em] text-[#7A726A] transition-colors hover:text-[#2C2825]"
            >
              View the menu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
