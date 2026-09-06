import type { SalonProfile } from "@/types/salon";

interface InstagramStripProps {
  salon: SalonProfile;
}

export function InstagramStrip({ salon }: InstagramStripProps) {
  const handle = (salon.instagram ?? "").trim().replace(/^@/, "");
  if (!handle) return null;

  return (
    <section className="border-y border-[#E5DDD4] py-14">
      <div className="mx-auto max-w-6xl px-8 text-center lg:px-12">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
          @{handle}
        </p>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl text-[#2C2825]">
          Follow along for daily inspiration
        </p>
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block border-b border-[#C9A897] pb-0.5 text-[10px] font-medium uppercase tracking-[0.25em] text-[#2C2825] transition-colors hover:text-[#C9A897]"
        >
          View on Instagram
        </a>
      </div>
    </section>
  );
}
