import type { SalonProfile } from "@/types/salon";
import { formatPrice } from "@/lib/format";

interface ServicesProps {
  salon: SalonProfile;
}

/** Magazine menu: name ···· price in a single editorial column. */
export function Services({ salon }: ServicesProps) {
  return (
    <section id="services" className="border-t border-[#E5DDD4] py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-2xl px-4 sm:px-8 lg:px-12">
        <div className="flex items-baseline justify-between gap-4 border-b border-[#E5DDD4] pb-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
              Menu
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2C2825] sm:text-4xl">
              Services &amp; pricing
            </h2>
          </div>
          <a
            href="#book"
            className="hidden shrink-0 text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A897] sm:inline"
          >
            Book →
          </a>
        </div>

        <ul className="mt-2">
          {salon.services.map((service) => (
            <li
              key={service.id}
              className="border-b border-[#E5DDD4]/80 py-7 first:pt-8"
            >
              <a href="#book" className="group block">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <h3 className="shrink-0 font-[family-name:var(--font-cormorant)] text-xl text-[#2C2825] transition-colors group-hover:text-[#C9A897] sm:text-2xl">
                    {service.name}
                  </h3>
                  <span
                    className="mb-1.5 hidden min-w-[2rem] flex-1 border-b border-dotted border-[#C9A897]/50 sm:block"
                    aria-hidden
                  />
                  <p className="ml-auto shrink-0 font-[family-name:var(--font-cormorant)] text-xl text-[#2C2825] sm:ml-0 sm:text-2xl">
                    {formatPrice(service.price)}
                  </p>
                </div>
                {service.description ? (
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#7A726A]">
                    {service.description}
                  </p>
                ) : null}
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#9C9088]">
                  {service.duration}
                  {service.deposit !== undefined && service.deposit > 0
                    ? ` · ${formatPrice(service.deposit)} deposit`
                    : ""}
                </p>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-[#7A726A]">
          Ready when you are.{" "}
          <a
            href="#book"
            className="border-b border-[#C9A897] text-[#2C2825] transition-colors hover:text-[#C9A897]"
          >
            Reserve your appointment
          </a>
        </p>
      </div>
    </section>
  );
}
