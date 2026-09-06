const items = [
  "Editorial blends",
  "By appointment",
  "Natural movement",
  "Quiet luxury",
  "Texture inclusive",
  "Seamless installs",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-[#E5DDD4] py-4">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-10 flex items-center gap-10 text-[10px] font-medium uppercase tracking-[0.4em] text-[#7A726A]"
          >
            {item}
            <span className="text-[#C9A897]">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
