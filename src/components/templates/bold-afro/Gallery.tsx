import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface GalleryProps {
  salon: SalonProfile;
}

export function Gallery({ salon }: GalleryProps) {
  return (
    <section id="gallery" className="bg-[#C45C3E] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8A849]">
            Gallery
          </p>
          <h2 className="mt-3 text-4xl font-extrabold text-[#FFF8F0] lg:text-5xl">
            Real transformations
          </h2>
        </div>

        <div className="mt-12 columns-2 gap-4 md:columns-3 md:gap-5">
          {salon.gallery.map((item, i) => (
            <figure
              key={item.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl ring-2 ring-[#E8A849]/30 md:mb-5"
            >
              <div className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {item.label && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-[#1B4332]/80 p-4 text-[10px] font-bold uppercase tracking-wider text-[#E8A849]">
                    {item.label}
                  </figcaption>
                )}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
