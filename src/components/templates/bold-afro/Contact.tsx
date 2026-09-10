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
    <section id="contact" className="relative bg-[#C45C3E] py-20 text-[#FFF8F0] lg:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 h-px opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #FFF8F0 0, #FFF8F0 4px, transparent 4px, transparent 8px)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8A849]">
              Contact
            </p>
            <h2 className="mt-3 text-4xl font-extrabold lg:text-5xl">
              Let&apos;s connect
            </h2>
            <p className="mt-5 max-w-sm text-[#FFF8F0]/75">
              Questions before booking? Drop us a line, we reply within 24 hours.
            </p>
            <a
              href="#book"
              className="mt-8 inline-flex rounded-2xl bg-[#1B4332] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#E8A849] transition-transform hover:scale-105"
            >
              Book online
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard label="Location" value={salon.address} />
            <ContactCard
              label="Email"
              value={email}
              href={email ? `mailto:${email}` : undefined}
            />
            <ContactCard
              label="Phone"
              value={phone}
              href={phone ? `tel:${phone.replace(/\s/g, "")}` : undefined}
            />
            <ContactCard
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

function ContactCard({
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
        className="mt-2 block text-lg font-semibold transition-colors hover:text-[#E8A849]"
      >
        {display}
      </a>
    ) : (
      <p className="mt-2 text-lg font-semibold">{display}</p>
    );

  return (
    <div className="rounded-2xl bg-[#1B4332]/40 p-6 backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8A849]/80">
        {label}
      </p>
      {inner}
    </div>
  );
}
