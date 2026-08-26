import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
    songs: Song[];
    albums: Album[];
    // tracks with no albumId — the release is the song itself
    singles: Song[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    featuredSongs: Song[];
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchSingles: () => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    singles: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalSingles: 0,
        totalUsers: 0,
        totalArtists: 0,
    },

    deleteSong: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/songs/${id}`);

            set((state) => ({
                songs: state.songs.filter((song) => song._id !== id),
                // a deleted track may also have been a single
                singles: state.singles.filter((song) => song._id !== id),
                stats: {
                    ...state.stats,
                    totalSongs: Math.max(0, state.stats.totalSongs - 1),
                    totalSingles: state.singles.some((song) => song._id === id)
                        ? Math.max(0, state.stats.totalSingles - 1)
                        : state.stats.totalSingles,
                },
            }));
            toast.success("Song deleted successfully");
        } catch (error) {
            console.log("Error in deleteSong", error);
            toast.error("Error deleting song");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAlbum: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/albums/${id}`);
            set((state) => {
                // the server deletes the album's tracks with it, so drop them here too
                const removed = state.songs.filter((song) => song.albumId === id).length;
                return {
                    albums: state.albums.filter((album) => album._id !== id),
                    songs: state.songs.filter((song) => song.albumId !== id),
                    stats: {
                        ...state.stats,
                        totalAlbums: Math.max(0, state.stats.totalAlbums - 1),
                        totalSongs: Math.max(0, state.stats.totalSongs - removed),
                    },
                };
            });
            toast.success("Album deleted successfully");
        } catch (error) {
            toast.error("Failed to delete album: " + (error as Error).message);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs");
            set({ songs: response.data });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSingles: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/singles");
            set({ singles: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/stats");
            set({ stats: response.data });
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/albums");
            set({ albums: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbumById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
