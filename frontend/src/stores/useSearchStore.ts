import { axiosInstance } from "@/lib/axios";
import type { Album, Artist, Song } from "@/types";
import type { AxiosError } from "axios";
import { create } from "zustand";

interface SearchResults {
    songs: Song[];
    albums: Album[];
    artists: Artist[];
}

interface SearchStore {
    query: string;
    results: SearchResults;
    isLoading: boolean;
    error: string | null;

    setQuery: (q: string) => void;
    search: (q: string) => Promise<void>;
    reset: () => void;
}

const EMPTY: SearchResults = { songs: [], albums: [], artists: [] };

// guards against out-of-order responses: only the latest query's result is kept
let latestQuery = "";

export const useSearchStore = create<SearchStore>((set) => ({
    query: "",
    results: EMPTY,
    isLoading: false,
    error: null,

    setQuery: (q) => set({ query: q }),

    search: async (q) => {
        const trimmed = q.trim();
        latestQuery = trimmed;

        if (!trimmed) {
            set({ results: EMPTY, isLoading: false, error: null });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/search", { params: { q: trimmed } });
            if (latestQuery !== trimmed) return; // a newer query superseded this one
            set({ results: res.data, isLoading: false });
        } catch (error) {
            if (latestQuery !== trimmed) return;
            set({
                error: (error as AxiosError<{ message: string }>).response?.data?.message ?? "Search failed",
                isLoading: false,
            });
        }
    },

    reset: () => set({ query: "", results: EMPTY, isLoading: false, error: null }),
}));