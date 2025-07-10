import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getSizeTrans(fs: number): string {
	if (fs < 1024) {
		return String(fs);
	} else if (fs < 1024 * 1024) {
		return parseInt(String((fs * 10) / 1024)) / 10 + " KB";
	} else if (fs < 1024 * 1024 * 1024) {
		return parseInt(String((fs * 10) / 1024 / 1024)) / 10 + " MB";
	} else {
		return parseInt(String((fs * 10) / 1024 / 1024 / 1024)) / 10 + " GB";
	}
}