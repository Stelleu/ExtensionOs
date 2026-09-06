import type { HairAddonPriceEntry } from "@/types/database";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface HairAddonCardProps {
  entry: HairAddonPriceEntry;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

/** Photo + length/texture + price card used in booking carousel and recommendations. */
export function HairAddonCard({
  entry,
  selected,
  onSelect,
  className,
}: HairAddonCardProps) {
  const interactive = typeof onSelect === "function";
  const content = (
    <>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#FAF8F5]">
        {entry.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.image_url}
            alt={`${entry.length} ${entry.texture}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback instanceof HTMLElement) {
                fallback.style.display = "flex";
              }
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            entry.image_url ? "hidden" : "flex"
          }`}
          aria-hidden
        >
          <HairAddonPlaceholder texture={entry.texture} />
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-[#1A1614]">
        {entry.length === "—"
          ? entry.texture
          : `${entry.length} · ${entry.texture}`}
      </p>
      {entry.price > 0 && (
        <p className="text-sm font-serif text-[#B8956E]">
          {formatPrice(entry.price)}
        </p>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-[140px] shrink-0 rounded-2xl border p-2 text-left transition-all",
          selected
            ? "border-[#B8956E] bg-white ring-2 ring-[#B8956E]/20"
            : "border-[#E8E0D8] bg-white hover:border-[#B8956E]/40",
          className
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "w-[140px] shrink-0 rounded-2xl border border-[#E8E0D8] bg-white p-2",
        className
      )}
    >
      {content}
    </div>
  );
}

function HairAddonPlaceholder({ texture }: { texture: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
      <svg
        viewBox="0 0 24 56"
        className="h-12 w-5 text-[#C4B8B0]"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 4 C18 12 6 20 12 28 C18 36 6 44 12 52"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[9px] uppercase tracking-wider text-[#9C8E86]">
        {texture}
      </span>
    </div>
  );
}

interface HairAddonCarouselProps {
  entries: HairAddonPriceEntry[];
  selectedLength: string;
  selectedTexture: string;
  onSelect: (length: string, texture: string) => void;
}

export function HairAddonCarousel({
  entries,
  selectedLength,
  selectedTexture,
  onSelect,
}: HairAddonCarouselProps) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
        Choose length &amp; texture
      </span>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {entries.map((entry) => {
          const selected =
            entry.length === selectedLength &&
            entry.texture === selectedTexture;
          return (
            <HairAddonCard
              key={`${entry.length}-${entry.texture}`}
              entry={entry}
              selected={selected}
              onSelect={() => onSelect(entry.length, entry.texture)}
            />
          );
        })}
      </div>
    </div>
  );
}
