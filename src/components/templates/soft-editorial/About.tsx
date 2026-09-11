import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface AboutProps {
  salon: SalonProfile;
}

/** Narrow editorial column with image as a margin figure. */
export function About({ salon }: AboutProps) {
  return (
    <section id="about" className="border-t border-[#E5DDD4] py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden lg:mx-0 lg:max-w-none">
            <Image
              src="https://images.unsplash.com/photo-1715220210514-5b52d4893f65?q=80&w=1287&auto=format&fit=crop"
              alt="Salon work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 30vw"
            />
          </div>

          <div className="lg:pt-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
              The studio
            </p>
            <h2 className="mt-4 max-w-lg font-[family-name:var(--font-cormorant)] text-3xl font-light leading-tight text-[#2C2825] sm:text-4xl lg:text-5xl">
              Crafted with intention
            </h2>
            <div className="mt-8 max-w-xl space-y-5 text-sm leading-relaxed text-[#7A726A] sm:text-base">
              <p>{salon.bio}</p>
              <p>
                Every consultation begins with listening — your lifestyle, your
                texture, your vision — before a single strand is placed.
              </p>
            </div>
            <div className="mt-10 grid gap-3 border-t border-[#E5DDD4] pt-8 sm:grid-cols-2">
              {[
                "Custom colour matching",
                "All textures welcome",
                "Unhurried appointments",
                "Aftercare guidance",
              ].map((item) => (
                <p
                  key={item}
                  className="text-[11px] uppercase tracking-[0.2em] text-[#2C2825]"
                >
                  <span className="mr-2 text-[#C9A897]">—</span>
                  {item}
                </p>
              ))}
            </div>
            <a
              href="#book"
              className="mt-12 inline-flex min-h-11 items-center border-b border-[#C9A897] text-[11px] font-medium uppercase tracking-[0.28em] text-[#2C2825] transition-colors hover:text-[#C9A897]"
            >
              Book a consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
