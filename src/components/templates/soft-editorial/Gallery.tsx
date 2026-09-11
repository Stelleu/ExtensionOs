import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface GalleryProps {
  salon: SalonProfile;
}

/** Magazine masonry: uneven column heights, caption as folio numbers. */
export function Gallery({ salon }: GalleryProps) {
  return (
    <section id="gallery" className="border-t border-[#E5DDD4] py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
              Portfolio
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-light text-[#2C2825] sm:text-4xl lg:text-5xl">
              In the pages
            </h2>
          </div>
          <p className="max-w-xs text-sm text-[#7A726A]">
            A selection of recent installs — real clients, real texture.
          </p>
        </div>

        <div className="columns-1 gap-6 sm:columns-2 sm:gap-8 lg:columns-3">
          {salon.gallery.map((item, i) => (
            <figure
              key={item.id}
              className="mb-6 break-inside-avoid sm:mb-8"
            >
              <div
                className={`relative overflow-hidden ${
                  i % 4 === 0
                    ? "aspect-[3/4]"
                    : i % 4 === 1
                      ? "aspect-square"
                      : i % 4 === 2
                        ? "aspect-[4/5]"
                        : "aspect-[5/6]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-t border-[#E5DDD4] pt-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#9C9088]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label ? (
                  <span className="text-right text-[10px] uppercase tracking-[0.15em] text-[#7A726A]">
                    {item.label}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
