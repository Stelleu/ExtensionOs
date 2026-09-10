import type { SalonProfile } from "@/types/salon";

interface ContactProps {
  salon: SalonProfile;
}

export function Contact({ salon }: ContactProps) {
  const phone = salon.phone?.trim() ?? "";
  const email = salon.email?.trim() ?? "";
  const instagram = salon.instagram?.trim() ?? "";
  const instagramHandle = instagram.replace(/^@/, "");

  return (
    <section id="contact" className="border-t border-[#E5DDD4] py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
              Contact
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2C2825] lg:text-5xl">
              Get in touch
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#7A726A]">
              Questions before booking? We typically reply within one business
              day.
            </p>
            <a
              href="#book"
              className="mt-10 inline-block border-b border-[#C9A897] pb-0.5 text-[10px] font-medium uppercase tracking-[0.25em] text-[#2C2825] transition-colors hover:text-[#C9A897]"
            >
              Book online instead
            </a>
          </div>

          <div className="divide-y divide-[#E5DDD4] border-y border-[#E5DDD4]">
            <ContactRow label="Location" value={salon.address} />
            <ContactRow
              label="Email"
              value={email}
              href={email ? `mailto:${email}` : undefined}
            />
            <ContactRow
              label="Phone"
              value={phone}
              href={phone ? `tel:${phone.replace(/\s/g, "")}` : undefined}
            />
            <ContactRow
              label="Instagram"
              value={instagram}
              href={
                instagramHandle
                  ? `https://instagram.com/${instagramHandle}`
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const display = value?.trim() ? value : "—";
  const inner =
    href && value?.trim() ? (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="mt-1 block text-base text-[#2C2825] transition-colors hover:text-[#C9A897]"
      >
        {display}
      </a>
    ) : (
      <p className="mt-1 text-base text-[#2C2825]">{display}</p>
    );

  return (
    <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[120px_1fr] sm:gap-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9C9088]">
        {label}
      </p>
      {inner}
    </div>
  );
}
