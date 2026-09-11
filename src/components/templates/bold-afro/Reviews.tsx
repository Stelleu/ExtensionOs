import type { SalonProfile } from "@/types/salon";

interface ReviewsProps {
  salon: SalonProfile;
}

/** Horizontal color-block strip — energetic, not a three-card grid. */
export function Reviews({ salon }: ReviewsProps) {
  const tones = [
    "bg-[#1B4332] text-[#FFF8F0]",
    "bg-[#E8A849] text-[#1B4332]",
    "bg-[#C45C3E] text-[#FFF8F0]",
    "bg-[#FFF8F0] text-[#1B4332] ring-2 ring-[#1B4332]/15",
  ];

  return (
    <section id="reviews" className="relative bg-[#FFF8F0] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C45C3E]">
              Client love
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#1B4332] sm:text-4xl">
              They said it best
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#5C4A3A] sm:max-w-xs sm:text-right">
            Swipe through the vibes →
          </p>
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:gap-5 sm:px-8 lg:px-10">
        {salon.reviews.map((review, i) => (
          <blockquote
            key={review.id}
            className={`w-[min(85vw,22rem)] shrink-0 snap-center rounded-[1.75rem] p-6 sm:w-[24rem] sm:p-8 ${tones[i % tones.length]}`}
          >
            <div className="flex gap-1 text-[#E8A849]">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} />
              ))}
            </div>
            <p className="mt-5 text-base font-semibold leading-snug sm:text-lg">
              &ldquo;{review.text}&rdquo;
            </p>
            <footer className="mt-8">
              <cite className="not-italic text-sm font-extrabold uppercase tracking-wider">
                {review.author}
              </cite>
              <p className="mt-1 text-xs opacity-70">{review.date}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Star() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
