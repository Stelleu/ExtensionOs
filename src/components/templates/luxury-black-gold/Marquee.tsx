const items = [
  "Premium extensions",
  "London based",
  "Natural blends",
  "Book online",
  "Deposit secured",
  "Maintenance reminders",
  "Slay every day",
  "Hair is lifestyle",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-[#E8E0D8] bg-[#1A1614] py-3.5">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.35em] text-[#FAF8F5]/80">
            {item}
            <span className="text-[#B8956E]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
