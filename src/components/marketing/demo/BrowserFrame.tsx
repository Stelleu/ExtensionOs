import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  children: ReactNode;
  url?: string;
  variant?: "desktop" | "phone";
  className?: string;
}

export function BrowserFrame({
  children,
  url = "yourstudio.extensionos.com/book",
  variant = "desktop",
  className,
}: BrowserFrameProps) {
  if (variant === "phone") {
    return (
      <div
        className={cn(
          "mx-auto w-[280px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1224] p-2 shadow-2xl",
          className
        )}
      >
        <div className="flex items-center justify-center rounded-t-[1.5rem] bg-[#0c0a0f] py-2">
          <div className="h-1 w-16 rounded-full bg-white/10" />
        </div>
        <div className="overflow-hidden rounded-b-[1.5rem] bg-[#FAF8F5]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#1a1224] shadow-2xl",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 truncate text-center text-[10px] text-[var(--mkt-text-dim)]">
          {url}
        </span>
      </div>
      <div className="bg-[#FAF8F5]">{children}</div>
    </div>
  );
}
