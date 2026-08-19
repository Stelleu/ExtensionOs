import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn/ui helper — keep this file minimal so CLI regenerations don't wipe app helpers.
 *  App helpers live in `@/lib/salon-helpers`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
