import Link from "next/link";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

export function GradientButton({
  href,
  children,
  variant = "primary",
  className,
}: GradientButtonProps) {
  if (variant === "ghost") {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--mkt-text)] transition-all hover:border-[var(--mkt-accent-rose)]/50 hover:bg-white/5",
          className
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "marketing-shimmer marketing-gradient-bg inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0c0a0f] transition-transform hover:scale-[1.02] hover:shadow-[0_0_40px_-8px_var(--mkt-glow)]",
        className
      )}
    >
      {children}
    </Link>
  );
}
