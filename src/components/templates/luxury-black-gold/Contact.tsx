import type { SalonProfile } from "@/types/salon";

interface ContactProps {
  salon: SalonProfile;
}

export function Contact({ salon }: ContactProps) {
  return (
    <section id="contact" className="bg-[#1A1614] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
              Let&apos;s connect
            </p>
            <h2 className="mt-4 font-serif text-4xl lg:text-5xl">
              Slide into our DMs<br />or book direct
            </h2>
            <p className="mt-6 max-w-sm text-white/50">
              Questions before booking? We typically reply within 24 hours.
            </p>
            <a
              href="#book"
              className="mt-8 inline-flex rounded-full bg-[#B8956E] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#A07F5C]"
            >
              Book online instead
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <ContactCard label="Location" value={salon.address} />
            <ContactCard label="Email" value={salon.email} href={`mailto:${salon.email}`} />
            <ContactCard label="Phone" value={salon.phone} href={`tel:${salon.phone.replace(/\s/g, "")}`} />
            <ContactCard
              label="Instagram"
              value={salon.instagram}
              href={`https://instagram.com/${salon.instagram.replace("@", "")}`}
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
  const inner = href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-2 block text-lg text-white transition-colors hover:text-[#B8956E]">
      {value}
    </a>
  ) : (
    <p className="mt-2 text-lg text-white">{value}</p>
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">{label}</p>
      {inner}
    </div>
  );
}
