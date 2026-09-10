import type { SalonProfile } from "@/types/salon";
import { formatPrice } from "@/lib/format";

interface ServicesProps {
  salon: SalonProfile;
}

export function Services({ salon }: ServicesProps) {
  return (
    <section id="services" className="bg-[#1B4332] py-20 text-[#FFF8F0] lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8A849]">
              Services
            </p>
            <h2 className="mt-3 text-4xl font-extrabold lg:text-5xl">
              The menu
            </h2>
          </div>
          <p className="max-w-xs text-sm text-[#FFF8F0]/70">
            Clear pricing. Secure your spot with a deposit, no surprises.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {salon.services.map((service, i) => (
            <article
              key={service.id}
              className={`group flex flex-col rounded-3xl p-8 transition-transform hover:-translate-y-1 ${
                i % 3 === 1
                  ? "bg-[#C45C3E]"
                  : i % 3 === 2
                    ? "bg-[#E8A849] text-[#1B4332]"
                    : "bg-[#FFF8F0] text-[#1B4332]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold">{service.name}</h3>
                <p className="text-xl font-extrabold">{formatPrice(service.price)}</p>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed opacity-80">
                {service.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {service.duration}
                </span>
                {service.deposit !== undefined && service.deposit > 0 && (
                  <span className="rounded-full bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {formatPrice(service.deposit)} deposit
                  </span>
                )}
              </div>
              <a
                href="#book"
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80 transition-opacity group-hover:opacity-100"
              >
                Book this →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
