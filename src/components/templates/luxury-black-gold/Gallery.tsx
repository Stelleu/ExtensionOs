import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface GalleryProps {
  salon: SalonProfile;
}

export function Gallery({ salon }: GalleryProps) {
  return (
    <section id="gallery" className="bg-[#1A1614] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
            The Glow Up
          </p>
          <h2 className="mt-4 font-serif text-4xl lg:text-5xl">
            Real results, real queens
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
            Tag us in your photos to be featured ✦ @{salon.instagram.replace("@", "")}
          </p>
        </div>

        <div className="mt-14 columns-2 gap-4 md:columns-3 md:gap-5">
          {salon.gallery.map((item, i) => (
            <figure
              key={item.id}
              className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl md:mb-5 ${
                i === 0 ? "md:rounded-3xl" : ""
              }`}
            >
              <div className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {item.label && (
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 translate-y-full text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 transition-transform duration-300 group-hover:translate-y-0">
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
