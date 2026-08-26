import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatArtists(artist?: string | string[] | null) {
  if (!artist) return "";
  return Array.isArray(artist) ? artist.join(", ") : artist;
}
// Axios puts the server's JSON body on error.response.data — error.message is
// just "Request failed with status code 400", which tells a user nothing.
export function apiErrorMessage(error: unknown, fallback: string) {
  const data = (error as { response?: { data?: { message?: string } } })?.response?.data;
  return data?.message || fallback;
}
