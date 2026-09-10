import Link from "next/link";
import { MARKETING_CONFIG } from "@/components/marketing/config";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[var(--mkt-bg-elevated)]">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-[var(--mkt-text)]">
              {MARKETING_CONFIG.productName}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--mkt-text-muted)]">
              The booking and client platform built exclusively for hair-extension
              specialists, not another generic salon tool.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--mkt-text-dim)]">
              Product
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--mkt-text-muted)]">
              <li>
                <Link href="/features" className="transition-colors hover:text-[var(--mkt-accent-rose)]">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-[var(--mkt-accent-rose)]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="transition-colors hover:text-[var(--mkt-accent-rose)]">
                  Live demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--mkt-text-dim)]">
              Connect
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--mkt-text-muted)]">
              <li>
                <a
                  href={`mailto:${MARKETING_CONFIG.contactEmail}`}
                  className="transition-colors hover:text-[var(--mkt-accent-rose)]"
                >
                  {MARKETING_CONFIG.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={MARKETING_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--mkt-accent-rose)]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={MARKETING_CONFIG.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--mkt-accent-rose)]"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-[var(--mkt-text-dim)] sm:flex-row">
          <p>© {year} {MARKETING_CONFIG.productName}. All rights reserved.</p>
          <p>Built for extension artists who refuse to settle.</p>
        </div>
      </div>
    </footer>
  );
}
