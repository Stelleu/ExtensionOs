"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitReview } from "@/lib/actions/reviews";
import type { TemplateId } from "@/types/salon";

type LeaveReviewFormProps = {
  token: string;
  businessName: string;
  templateId: TemplateId;
  salonSlug: string;
  alreadySubmitted: boolean;
};

const THEME_STYLES: Record<
  TemplateId,
  {
    page: string;
    card: string;
    brand: string;
    title: string;
    muted: string;
    button: string;
    starActive: string;
    starIdle: string;
    textarea: string;
  }
> = {
  "luxury-black-gold": {
    page: "bg-[#FAF8F5]",
    card: "bg-white shadow-[0_8px_60px_-12px_rgba(26,22,20,0.12)] ring-1 ring-[#1A1614]/5",
    brand: "text-[#B8956E] font-semibold tracking-[0.35em] uppercase text-[11px]",
    title: "font-serif text-[#1A1614]",
    muted: "text-[#6B5E58]",
    button: "bg-[#1A1614] text-white hover:bg-[#2a2420]",
    starActive: "text-[#B8956E]",
    starIdle: "text-[#E8E0D8]",
    textarea:
      "border-[#E8E0D8] bg-[#FAF8F5] text-[#1A1614] focus:border-[#B8956E] focus:ring-[#B8956E]/30",
  },
  "soft-editorial": {
    page: "bg-[#FAF6F1]",
    card: "bg-white border border-[#E5DDD4]",
    brand: "text-[#C9A897] font-medium tracking-[0.3em] uppercase text-[11px]",
    title: "font-[family-name:var(--font-cormorant)] text-[#2C2825]",
    muted: "text-[#7A726A]",
    button: "bg-[#2C2825] text-[#FAF6F1] hover:bg-[#3d3732]",
    starActive: "text-[#C9A897]",
    starIdle: "text-[#E5DDD4]",
    textarea:
      "border-[#E5DDD4] bg-[#FAF6F1] text-[#2C2825] focus:border-[#C9A897] focus:ring-[#C9A897]/30",
  },
  "bold-afro": {
    page: "bg-[#FFF8F0]",
    card: "bg-white ring-2 ring-[#1B4332]/10",
    brand: "text-[#C45C3E] font-bold tracking-[0.2em] uppercase text-xs",
    title: "font-extrabold text-[#1B4332]",
    muted: "text-[#5C4A3A]",
    button: "bg-[#1B4332] text-[#FFF8F0] hover:bg-[#245c42]",
    starActive: "text-[#E8A849]",
    starIdle: "text-[#1B4332]/20",
    textarea:
      "border-[#1B4332]/15 bg-[#FFF8F0] text-[#1B4332] focus:border-[#C45C3E] focus:ring-[#C45C3E]/25",
  },
};

export function LeaveReviewForm({
  token,
  businessName,
  templateId,
  salonSlug,
  alreadySubmitted,
}: LeaveReviewFormProps) {
  const styles = THEME_STYLES[templateId];
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(alreadySubmitted);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitReview(token, rating, comment);
      if (!result.ok) {
        setError(result.error);
        if (result.error.toLowerCase().includes("already")) {
          setDone(true);
        }
        return;
      }
      setDone(true);
    });
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-6 py-16 ${styles.page}`}
    >
      <div className={`w-full max-w-lg rounded-3xl p-8 sm:p-10 ${styles.card}`}>
        <p className={styles.brand}>{businessName}</p>

        {done ? (
          <div className="mt-6 text-center">
            <h1 className={`text-3xl ${styles.title}`}>
              {alreadySubmitted && !error
                ? "You've already left a review"
                : "Thank you!"}
            </h1>
            <p className={`mt-4 text-sm leading-relaxed ${styles.muted}`}>
              {alreadySubmitted && !error
                ? "We appreciate your feedback."
                : "Your review has been submitted. We appreciate you taking the time."}
            </p>
            <Link
              href={`/${salonSlug}`}
              className={`mt-8 inline-block rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition ${styles.button}`}
            >
              Back to salon page
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6">
            <h1 className={`text-3xl ${styles.title}`}>Leave a review</h1>
            <p className={`mt-3 text-sm leading-relaxed ${styles.muted}`}>
              How was your visit with {businessName}?
            </p>

            <div
              className="mt-8 flex justify-center gap-2"
              role="radiogroup"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const active = (hover || rating) >= value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(value)}
                    className={`transition ${active ? styles.starActive : styles.starIdle}`}
                  >
                    <StarIcon filled={active} />
                  </button>
                );
              })}
            </div>

            <label className="mt-8 block">
              <span className={`text-xs font-medium uppercase tracking-wider ${styles.muted}`}>
                Comment (optional)
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Tell others what you loved…"
                className={`mt-2 w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none ring-0 focus:ring-2 ${styles.textarea}`}
              />
            </label>

            {error ? (
              <p className="mt-4 text-center text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending || rating < 1}
              className={`mt-8 w-full rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-40 ${styles.button}`}
            >
              {pending ? "Submitting…" : "Submit review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      className="h-9 w-9"
      aria-hidden
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
