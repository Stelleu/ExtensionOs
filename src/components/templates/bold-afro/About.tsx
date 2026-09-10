import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface AboutProps {
  salon: SalonProfile;
}

export function About({ salon }: AboutProps) {
  return (
    <section id="about" className="overflow-x-clip bg-[#FFF8F0] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1715220210514-5b52d4893f65?q=80&w=1287&auto=format&fit=crop"
                alt="Salon work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="absolute -bottom-4 -right-2 rounded-2xl bg-[#C45C3E] px-6 py-4 text-white shadow-xl sm:-bottom-6 sm:-right-4 sm:px-8 sm:py-5">
              <p className="text-3xl font-extrabold">8+</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                Years experience
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C45C3E]">
              About the studio
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[#1B4332] lg:text-5xl">
              Where skill meets soul
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-[#5C4A3A]">
              <p>{salon.bio}</p>
              <p>
                We celebrate every texture, every style, creating looks that
                feel as good as they look.
              </p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Custom colour matching",
                "All textures welcome",
                "Warm studio energy",
                "Aftercare included",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-[#1B4332]/5 px-4 py-3 text-sm font-semibold text-[#1B4332]"
                >
                  <span className="text-[#E8A849]">◆</span>
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
