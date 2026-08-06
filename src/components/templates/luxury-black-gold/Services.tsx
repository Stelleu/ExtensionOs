import type { SalonProfile } from "@/types/salon";
import { formatPrice } from "@/lib/format";

interface ServicesProps {
  salon: SalonProfile;
}

export function Services({ salon }: ServicesProps) {
  return (
    <section id="services" className="bg-[#FAF8F5] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
              The Menu
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#1A1614] lg:text-5xl">
              Services &amp; pricing
            </h2>
          </div>
          <p className="max-w-xs text-sm text-[#6B5E58]">
            Transparent pricing. Secure your slot with a deposit — no more
            no-shows.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {salon.services.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col rounded-3xl bg-white p-8 shadow-[0_4px_40px_-12px_rgba(26,22,20,0.08)] ring-1 ring-[#1A1614]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_50px_-12px_rgba(26,22,20,0.15)]"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-serif text-2xl text-[#1A1614] group-hover:text-[#B8956E] transition-colors">
                  {service.name}
                </h3>
                <p className="font-serif text-2xl text-[#B8956E]">
                  {formatPrice(service.price)}
                </p>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[#6B5E58]">
                {service.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#FAF8F5] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#9C8E86]">
                  {service.duration}
                </span>
                {service.deposit !== undefined && service.deposit > 0 && (
                  <span className="rounded-full border border-[#B8956E]/30 px-3 py-1 text-[11px] font-medium text-[#B8956E]">
                    {formatPrice(service.deposit)} deposit
                  </span>
                )}
              </div>
              <a
                href="#book"
                className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1614] transition-colors group-hover:text-[#B8956E]"
              >
                Book this
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
