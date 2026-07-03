import { axiosInstance } from "@/lib/axios";
import type { Album, Artist, Song } from "@/types";
import { create } from "zustand";

export interface ArtistWithContent extends Artist {
  songs: Song[];
  albums: Album[];
}

interface ArtistStore {
  currentArtist: ArtistWithContent | null;
  isLoading: boolean;
  error: string | null;
  fetchArtistById: (id: string) => Promise<void>;
}

export const useArtistStore = create<ArtistStore>((set) => ({
  currentArtist: null,
  isLoading: false,
  error: null,

  fetchArtistById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/artists/${id}`);
      set({ currentArtist: res.data, isLoading: false });
    } catch {
      set({
        error: "Failed to load artist",
        isLoading: false,
        currentArtist: null,
      });
    }
  },
}));
