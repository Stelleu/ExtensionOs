import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface AboutProps {
  salon: SalonProfile;
}

/** Full-bleed color band + offset type — not a conventional two-column bio. */
export function About({ salon }: AboutProps) {
  return (
    <section id="about" className="relative overflow-x-clip bg-[#1B4332]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[#FFF8F0] sm:h-12"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 20%)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14 lg:px-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8A849]">
            The studio
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[0.95] text-[#FFF8F0] sm:text-5xl lg:text-6xl">
            Skill.
            <br />
            Soul.
            <br />
            <span className="text-[#E8A849]">Style.</span>
          </h2>
          <div className="mt-8 max-w-lg space-y-4 text-base leading-relaxed text-[#FFF8F0]/85">
            <p>{salon.bio}</p>
            <p>
              Every texture welcome. Warm energy. Looks that feel as good as
              they look.
            </p>
          </div>
          <a
            href="#book"
            className="mt-10 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#E8A849] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1B4332] transition-transform hover:scale-[1.02]"
          >
            Book with us
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-[#E8A849]/50"
            style={{ transform: "rotate(2deg)" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1715220210514-5b52d4893f65?q=80&w=1287&auto=format&fit=crop"
              alt="Salon work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-2 sm:gap-3">
            {[
              "All textures",
              "Custom colour",
              "Warm energy",
              "Aftercare",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl bg-[#C45C3E] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#FFF8F0] sm:px-4 sm:py-3.5 sm:text-xs"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-[#FFF8F0] sm:h-12"
        style={{ clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0 100%)" }}
        aria-hidden
      />
    </section>
  );
}
