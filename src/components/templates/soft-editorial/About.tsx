import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface AboutProps {
  salon: SalonProfile;
}

export function About({ salon }: AboutProps) {
  return (
    <section id="about" className="py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="grid items-start gap-20 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="order-2 lg:order-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
              The studio
            </p>
            <h2 className="mt-5 font-[family-name:var(--font-cormorant)] text-4xl font-light leading-tight text-[#2C2825] lg:text-5xl">
              Crafted with intention
            </h2>
            <div className="mt-10 space-y-6 border-t border-[#E5DDD4] pt-10 text-[#7A726A] leading-relaxed">
              <p>{salon.bio}</p>
              <p>
                Every consultation begins with listening, your lifestyle, your
                texture, your vision, before a single strand is placed.
              </p>
            </div>
            <ul className="mt-12 space-y-4 border-t border-[#E5DDD4] pt-10">
              {[
                "Custom colour matching",
                "All textures welcome",
                "Unhurried appointments",
                "Aftercare guidance",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 text-sm text-[#2C2825]"
                >
                  <span className="text-[#C9A897]">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1715220210514-5b52d4893f65?q=80&w=1287&auto=format&fit=crop"
                alt="Salon work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
