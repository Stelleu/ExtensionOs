import type { SalonProfile } from "@/types/salon";

interface ReviewsProps {
  salon: SalonProfile;
}

/** Pull-quotes that interrupt the page like a magazine feature. */
export function Reviews({ salon }: ReviewsProps) {
  if (salon.reviews.length === 0) return null;

  const [featured, ...rest] = salon.reviews;

  return (
    <section id="reviews" className="border-y border-[#E5DDD4]">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <blockquote className="text-center">
          <div className="mb-6 flex justify-center gap-1 text-[#C9A897]">
            {Array.from({ length: featured.rating }).map((_, j) => (
              <Star key={j} />
            ))}
          </div>
          <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light leading-snug text-[#2C2825] sm:text-3xl lg:text-4xl lg:leading-snug">
            &ldquo;{featured.text}&rdquo;
          </p>
          <footer className="mt-8">
            {featured.author ? (
              <cite className="not-italic text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A897]">
                {featured.author}
              </cite>
            ) : null}
            {featured.date ? (
              <p className="mt-2 text-xs text-[#9C9088]">{featured.date}</p>
            ) : null}
          </footer>
        </blockquote>
      </div>

      {rest.length > 0 && (
        <div className="border-t border-[#E5DDD4]">
          <div className="mx-auto grid max-w-6xl divide-y divide-[#E5DDD4] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {rest.slice(0, 2).map((review) => (
              <blockquote
                key={review.id}
                className="px-4 py-12 sm:px-10 sm:py-16 lg:px-14"
              >
                <div className="mb-4 flex gap-1 text-[#C9A897]">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} />
                  ))}
                </div>
                <p className="font-[family-name:var(--font-cormorant)] text-xl font-light leading-relaxed text-[#2C2825]">
                  &ldquo;{review.text}&rdquo;
                </p>
                {(review.author || review.date) && (
                  <footer className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[#C9A897]">
                    {review.author || review.date}
                  </footer>
                )}
              </blockquote>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Star() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
