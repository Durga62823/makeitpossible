import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import xss from "xss";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function sanitizeInput<T extends string | undefined | null>(value: T) {
  if (!value) {
    return value ?? "";
  }

  return xss(value.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  });
}

export const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

