import type { SalonProfile } from "@/types/salon";

interface ReviewsProps {
  salon: SalonProfile;
}

export function Reviews({ salon }: ReviewsProps) {
  return (
    <section id="reviews" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
            Love letters
          </p>
          <h2 className="mt-4 font-serif text-4xl text-[#1A1614] lg:text-5xl">
            What the queens say
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {salon.reviews.map((review, i) => (
            <blockquote
              key={review.id}
              className={`flex flex-col rounded-3xl p-8 ${
                i === 1
                  ? "bg-[#1A1614] text-white md:-translate-y-4"
                  : "bg-[#FAF8F5] text-[#1A1614]"
              }`}
            >
              <div className="flex gap-1 text-[#B8956E]">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} />
                ))}
              </div>
              <p className={`mt-6 flex-1 text-sm leading-relaxed ${i === 1 ? "text-white/80" : "text-[#6B5E58]"}`}>
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className={`mt-8 border-t pt-6 ${i === 1 ? "border-white/10" : "border-[#E8E0D8]"}`}>
                <cite className="not-italic font-medium">{review.author}</cite>
                <p className={`mt-1 text-xs ${i === 1 ? "text-white/40" : "text-[#9C8E86]"}`}>
                  {review.date}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Star() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
