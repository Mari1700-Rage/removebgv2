import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getSizeTrans(fs: number): string {
	if (fs < 1024) {
		return `${fs} B`;
	} else if (fs < 1024 * 1024) {
		return `${(fs / 1024).toFixed(1)} KB`;
	} else if (fs < 1024 * 1024 * 1024) {
		return `${(fs / (1024 * 1024)).toFixed(1)} MB`;
	} else {
		return `${(fs / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	
}
