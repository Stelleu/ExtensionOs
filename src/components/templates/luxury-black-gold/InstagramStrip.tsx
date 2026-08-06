import type { SalonProfile } from "@/types/salon";

interface InstagramStripProps {
  salon: SalonProfile;
}

export function InstagramStrip({ salon }: InstagramStripProps) {
  const handle = salon.instagram.replace("@", "");

  return (
    <section className="border-y border-[#E8E0D8] bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
          @{handle} on Instagram
        </p>
        <p className="mt-2 font-serif text-2xl text-[#1A1614]">
          Follow for daily inspo &amp; transformations
        </p>
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1A1614] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1614] transition-all hover:bg-[#1A1614] hover:text-white"
        >
          Follow @{handle}
        </a>
      </div>
    </section>
  );
}
