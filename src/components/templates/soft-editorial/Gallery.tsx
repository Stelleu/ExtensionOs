import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface GalleryProps {
  salon: SalonProfile;
}

export function Gallery({ salon }: GalleryProps) {
  return (
    <section id="gallery" className="border-t border-[#E5DDD4] py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
            Portfolio
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2C2825] lg:text-5xl">
            Recent work
          </h2>
        </div>

        <div className="mt-16 grid gap-px bg-[#E5DDD4] sm:grid-cols-2 lg:grid-cols-3">
          {salon.gallery.map((item) => (
            <figure key={item.id} className="group relative aspect-[3/4] bg-[#FAF6F1]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {item.label && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2C2825]/60 to-transparent p-6 text-[10px] uppercase tracking-[0.2em] text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
