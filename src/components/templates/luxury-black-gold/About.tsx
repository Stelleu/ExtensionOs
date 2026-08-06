import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface AboutProps {
  salon: SalonProfile;
}

export function About({ salon }: AboutProps) {
  return (
    <section id="about" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1715220210514-5b52d4893f65?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Salon work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 rounded-2xl bg-[#1A1614] px-8 py-6 text-white shadow-2xl sm:-right-8">
              <p className="font-serif text-3xl">8+</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/60">
                Years of expertise
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
              Welcome, Queen
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#1A1614] lg:text-5xl">
              More than hair.<br />It&apos;s your confidence.
            </h2>
            <div className="mt-8 space-y-5 text-[#6B5E58] leading-relaxed">
              <p>{salon.bio}</p>
              <p>
                From consultation to aftercare, every detail is handled with care.
                No rushed appointments, no cookie-cutter installs — just you,
                elevated.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "Custom colour matching",
                "All textures welcome",
                "Private studio vibes",
                "Aftercare included",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#1A1614]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] text-[10px] text-[#B8956E]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
