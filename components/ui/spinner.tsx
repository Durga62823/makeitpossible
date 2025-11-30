"use client";

import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 animate-spin items-center justify-center rounded-full border-2 border-white/60 border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}
