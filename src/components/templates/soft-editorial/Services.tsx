import type { SalonProfile } from "@/types/salon";
import { formatPrice } from "@/lib/format";

interface ServicesProps {
  salon: SalonProfile;
}

export function Services({ salon }: ServicesProps) {
  return (
    <section id="services" className="border-t border-[#E5DDD4] py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="max-w-xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
            Services
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2C2825] lg:text-5xl">
            The menu
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#7A726A]">
            Transparent pricing. Secure your appointment with a deposit at
            checkout.
          </p>
        </div>

        <div className="mt-16 divide-y divide-[#E5DDD4] border-y border-[#E5DDD4]">
          {salon.services.map((service) => (
            <article
              key={service.id}
              className="group grid gap-6 py-10 sm:grid-cols-[1fr_auto] sm:items-start"
            >
              <div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#2C2825] transition-colors group-hover:text-[#C9A897]">
                  {service.name}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#7A726A]">
                  {service.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.2em] text-[#9C9088]">
                  <span>{service.duration}</span>
                  {service.deposit !== undefined && service.deposit > 0 && (
                    <span className="text-[#C9A897]">
                      {formatPrice(service.deposit)} deposit
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <p className="font-[family-name:var(--font-cormorant)] text-2xl text-[#2C2825]">
                  {formatPrice(service.price)}
                </p>
                <a
                  href="#book"
                  className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A897] opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Book →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
