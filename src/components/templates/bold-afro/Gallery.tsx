import Image from "next/image";
import type { SalonProfile } from "@/types/salon";

interface GalleryProps {
  salon: SalonProfile;
}

/** Overlapping stacked photos on desktop; horizontal tilted strip on mobile. */
export function Gallery({ salon }: GalleryProps) {
  const items = salon.gallery.slice(0, 6);
  const rotations = [-6, 4, -3, 7, -5, 2];

  return (
    <section
      id="gallery"
      className="relative overflow-x-clip bg-[#C45C3E] py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[#FFF8F0]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 35%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">
        <div className="mb-10 text-center sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8A849]">
            Gallery
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#FFF8F0] sm:text-4xl lg:text-5xl">
            Real transformations
          </h2>
        </div>

        {/* Mobile: horizontal tilted strip */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 md:hidden">
          {items.map((item, i) => (
            <figure
              key={item.id}
              className="w-[70vw] max-w-[16rem] shrink-0 snap-center overflow-hidden rounded-2xl shadow-xl ring-4 ring-[#E8A849]/40"
              style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="70vw"
                />
              </div>
              {item.label ? (
                <figcaption className="bg-[#1B4332] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#E8A849]">
                  {item.label}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>

        {/* Desktop: overlapping stack */}
        <div className="relative mx-auto hidden min-h-[34rem] max-w-3xl md:block">
          {items.map((item, i) => {
            const positions = [
              "left-[4%] top-[4%] z-[1] w-[58%]",
              "right-[2%] top-[8%] z-[2] w-[52%]",
              "left-[10%] top-[38%] z-[3] w-[55%]",
              "right-[6%] top-[42%] z-[4] w-[50%]",
              "left-[18%] top-[68%] z-[5] w-[48%]",
              "right-[12%] top-[72%] z-[6] w-[46%]",
            ];
            return (
              <figure
                key={item.id}
                className={`absolute overflow-hidden rounded-2xl shadow-2xl ring-4 ring-[#E8A849]/40 transition-transform hover:z-20 hover:scale-[1.03] ${positions[i % positions.length]}`}
                style={{
                  transform: `rotate(${rotations[i % rotations.length]}deg)`,
                }}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="40vw"
                  />
                </div>
                {item.label ? (
                  <figcaption className="bg-[#1B4332] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#E8A849]">
                    {item.label}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[#1B4332]"
        style={{ clipPath: "polygon(0 60%, 100% 0, 100% 100%, 0 100%)" }}
        aria-hidden
      />
    </section>
  );
}
