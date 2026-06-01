import { create } from 'zustand';
import {axiosInstance} from "@/lib/axios.ts";

interface MusicStore {
    songs: any[];
    albums: any[];
    isLoading: boolean;
    error: string | null;

    fetchAlbums: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/albums");

            set({ albums: response.data});
        } catch (err: any) {
            set({ error: err.response?.data?.message ?? err.message });

        } finally {
            set({ isLoading: false });
        }
    },
}));