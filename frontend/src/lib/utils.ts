import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatArtists(artist?: string | string[] | null) {
  if (!artist) return "";
  return Array.isArray(artist) ? artist.join(", ") : artist;
}