const items = [
  "Bold blends",
  "All textures",
  "Book online",
  "Expert care",
  "Vibrant colour",
  "Crown ready",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-[#1B4332] py-3">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-8 flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8A849]"
          >
            {item}
            <span className="text-[#C45C3E]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
