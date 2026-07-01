import { axiosInstance } from "@/lib/axios";
import type { Album, Artist } from "@/types";
import type { AxiosError } from "axios";
import { create } from "zustand";

interface LibraryStore {
  albums: Album[];
  artists: Artist[];
  playlists: unknown[];
  isLoading: boolean;

  fetchLibrary: () => Promise<void>;
  toggleAlbum: (albumId: string) => Promise<void>;
  isAlbumSaved: (albumId: string) => boolean;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  albums: [],
  artists: [],
  playlists: [],
  isLoading: false,

  fetchLibrary: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/library");
      set({
        albums: res.data.albums ?? [],
        artists: res.data.artists ?? [],
        playlists: res.data.playlists ?? [],
      });
    } catch (err) {
      // 401 (signed out) just means an empty library — not an error to surface
      const status = (err as AxiosError)?.response?.status;
      if (status !== 401) console.error("Failed to load library", err);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleAlbum: async (albumId: string) => {
    // optimistic: flip local state now, reconcile with the server response
    const wasSaved = get().isAlbumSaved(albumId);
    if (wasSaved) {
      set({ albums: get().albums.filter((a) => a._id !== albumId) });
    }

    try {
      const res = await axiosInstance.post(`/library/albums/${albumId}`);
      // resync to get the correct populated album object on save
      if (res.data.saved !== wasSaved) await get().fetchLibrary();
    } catch (err) {
      console.error("Failed to update library", err);
      await get().fetchLibrary(); // revert to server truth on failure
    }
  },

  isAlbumSaved: (albumId: string) =>
    get().albums.some((a) => a._id === albumId),
}));
