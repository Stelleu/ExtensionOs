import type { SalonProfile } from "@/types/salon";

interface InstagramStripProps {
  salon: SalonProfile;
}

export function InstagramStrip({ salon }: InstagramStripProps) {
  const handle = (salon.instagram ?? "").trim().replace(/^@/, "");
  if (!handle) return null;

  return (
    <section className="bg-[#E8A849] py-12">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1B4332]/70">
          @{handle}
        </p>
        <p className="mt-2 text-2xl font-extrabold text-[#1B4332]">
          Follow the journey on Instagram
        </p>
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#1B4332] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#E8A849] transition-transform hover:scale-105"
        >
          Follow @{handle}
        </a>
      </div>
    </section>
  );
}
