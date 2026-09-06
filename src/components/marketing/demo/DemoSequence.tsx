"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DemoSequenceProps {
  title?: string;
  description?: string;
  videoSrc?: string;
  intervalMs?: number;
  children: ReactNode;
  className?: string;
}

export function DemoSequence({
  title,
  description,
  videoSrc,
  intervalMs = 3500,
  children,
  className,
}: DemoSequenceProps) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const childCount = slides.length || 1;

  useEffect(() => {
    const el = ref.current;
    if (!el || videoSrc) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoSrc]);

  useEffect(() => {
    if (!active || videoSrc) return;
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % childCount);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [active, childCount, intervalMs, videoSrc]);

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="font-display text-xl text-[var(--mkt-text)]">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-[var(--mkt-text-muted)]">
              {description}
            </p>
          )}
        </div>
      )}

      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full rounded-2xl"
        />
      ) : (
        <div className="relative min-h-[280px]">
          {slides.map((child, i) => (
            <div
              key={i}
              className={cn(
                "transition-all duration-700",
                i === step
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={i !== step}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
