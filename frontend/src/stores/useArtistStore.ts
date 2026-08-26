import { axiosInstance } from "@/lib/axios";
import type { Album, Artist, Song } from "@/types";
import { apiErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface ArtistWithContent extends Artist {
  songs: Song[];
  albums: Album[];
}

interface ArtistStore {
  artists: Artist[];
  currentArtist: ArtistWithContent | null;
  isLoading: boolean;
  error: string | null;

  fetchArtists: () => Promise<void>;
  fetchArtistById: (id: string) => Promise<void>;
  createArtist: (payload: { name: string; imageFile: File | null }) => Promise<boolean>;
  deleteArtist: (id: string) => Promise<void>;
}

export const useArtistStore = create<ArtistStore>((set) => ({
  artists: [],
  currentArtist: null,
  isLoading: false,
  error: null,

  fetchArtists: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/artists");
      set({ artists: res.data, isLoading: false });
    } catch (error) {
      set({ error: apiErrorMessage(error, "Failed to load artists"), isLoading: false });
    }
  },

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

  createArtist: async ({ name, imageFile }) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("imageFile", imageFile);

      const res = await axiosInstance.post("/admin/artists", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        artists: [...state.artists, res.data].sort((a, b) => a.name.localeCompare(b.name)),
        isLoading: false,
      }));
      toast.success(`Added ${res.data.name}`);
      return true;
    } catch (error) {
      // the API returns 409 with a message when the name is taken
      toast.error(apiErrorMessage(error, "Failed to create artist"));
      set({ isLoading: false });
      return false;
    }
  },

  deleteArtist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/artists/${id}`);
      set((state) => ({
        artists: state.artists.filter((artist) => artist._id !== id),
        isLoading: false,
      }));
      toast.success("Artist deleted");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Failed to delete artist"));
      set({ isLoading: false });
    }
  },
}));
