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
          <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light leading-snug text-[#2C2825] sm:text-3xl lg:text-4xl lg:leading-snug">
            &ldquo;{featured.text}&rdquo;
          </p>
          <footer className="mt-8">
            <cite className="not-italic text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A897]">
              {featured.author}
            </cite>
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
                <p className="font-[family-name:var(--font-cormorant)] text-xl font-light leading-relaxed text-[#2C2825]">
                  &ldquo;{review.text}&rdquo;
                </p>
                <footer className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[#C9A897]">
                  {review.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
