import type { SalonProfile } from "@/types/salon";

interface ReviewsProps {
  salon: SalonProfile;
}

export function Reviews({ salon }: ReviewsProps) {
  return (
    <section id="reviews" className="border-t border-[#E5DDD4] py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
            Testimonials
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2C2825] lg:text-5xl">
            Client words
          </h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {salon.reviews.map((review) => (
            <blockquote
              key={review.id}
              className="flex flex-col border-t border-[#E5DDD4] pt-8"
            >
              <div className="flex gap-1 text-[#C9A897]">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} />
                ))}
              </div>
              <p className="mt-6 flex-1 text-sm leading-relaxed text-[#7A726A]">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="mt-8 border-t border-[#E5DDD4] pt-6">
                <cite className="not-italic text-sm text-[#2C2825]">
                  {review.author}
                </cite>
                <p className="mt-1 text-xs text-[#9C9088]">{review.date}</p>
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
