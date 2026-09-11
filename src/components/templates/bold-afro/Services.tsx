import type { SalonProfile } from "@/types/salon";
import { formatPrice } from "@/lib/format";

interface ServicesProps {
  salon: SalonProfile;
}

const TILE: Record<number, string> = {
  0: "bg-[#C45C3E] text-[#FFF8F0] sm:col-span-2 sm:row-span-2",
  1: "bg-[#E8A849] text-[#1B4332]",
  2: "bg-[#1B4332] text-[#FFF8F0]",
  3: "bg-[#FFF8F0] text-[#1B4332] ring-2 ring-[#1B4332]/10 sm:col-span-2",
  4: "bg-[#C45C3E] text-[#FFF8F0]",
  5: "bg-[#E8A849] text-[#1B4332] sm:col-span-2",
};

/** Bento grid — varied tile sizes and strong color blocks. */
export function Services({ salon }: ServicesProps) {
  return (
    <section id="services" className="relative bg-[#FFF8F0] py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[#1B4332] sm:h-12"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-8 sm:pt-10 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C45C3E]">
              The menu
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1B4332] sm:text-4xl lg:text-5xl">
              Pick your glow
            </h2>
          </div>
          <a
            href="#book"
            className="inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-wider text-[#C45C3E]"
          >
            Book any service →
          </a>
        </div>

        <div className="grid auto-rows-[minmax(11rem,auto)] gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {salon.services.map((service, i) => (
            <a
              key={service.id}
              href="#book"
              className={`group flex flex-col justify-between rounded-[1.75rem] p-6 transition-transform hover:-translate-y-0.5 sm:p-7 ${
                TILE[i % 6]
              }`}
            >
              <div>
                <h3 className="text-xl font-extrabold leading-tight sm:text-2xl">
                  {service.name}
                </h3>
                {service.description ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed opacity-85">
                    {service.description}
                  </p>
                ) : null}
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {service.duration}
                  </span>
                  {service.deposit !== undefined && service.deposit > 0 && (
                    <span className="rounded-full bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      {formatPrice(service.deposit)} deposit
                    </span>
                  )}
                </div>
                <p className="text-2xl font-extrabold">
                  {formatPrice(service.price)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
