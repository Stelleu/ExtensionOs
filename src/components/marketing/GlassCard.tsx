import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow }: GlassCardProps) {
  return (
    <div
      className={cn(
        "marketing-glass rounded-3xl",
        glow && "marketing-glow",
        className
      )}
    >
      {children}
    </div>
  );
}
