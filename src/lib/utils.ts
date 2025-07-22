import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSizeTrans(fs: number): string {
  if (fs < 1024) {
    return fs + " bytes";
  } else if (fs < 1024 * 1024) {
    return Math.round((fs / 1024) * 10) / 10 + " KB";
  } else if (fs < 1024 * 1024 * 1024) {
    return Math.round((fs / (1024 * 1024)) * 10) / 10 + " MB";
  } else {
    return Math.round((fs / (1024 * 1024 * 1024)) * 10) / 10 + " GB";
  }
}
