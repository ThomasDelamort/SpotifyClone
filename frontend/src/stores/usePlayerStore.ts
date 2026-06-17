import { create } from "zustand";
import type { Song } from "@/types";

// Fisher–Yates shuffle (returns a new array, does not mutate input)
const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    originalQueue: Song[];
    currentIndex: number;
    isShuffled: boolean;

    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (songs: Song | null) => void;
    togglePlay: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    originalQueue: [],
    currentIndex: -1,
    isShuffled: false,

    initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            originalQueue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        });
    },

    playAlbum: (songs: Song[], startIndex = 0) => {
        if (songs.length === 0) return;

        const startSong = songs[startIndex];
        const { isShuffled } = get();

        // if shuffle is on, keep the chosen song first and shuffle the rest
        let queue = songs;
        if (isShuffled) {
            const rest = songs.filter((_, i) => i !== startIndex);
            queue = [startSong, ...shuffleArray(rest)];
        }

        set({
            originalQueue: songs,
            queue,
            currentSong: startSong,
            currentIndex: isShuffled ? 0 : startIndex,
            isPlaying: true,
        });
    },

    setCurrentSong: (song: Song | null) => {
        if (!song) return;

        const songIndex = get().queue.findIndex(s => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
        });
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;

        set({
            isPlaying: willStartPlaying,
        });
    },

    toggleShuffle: () => {
        const { isShuffled, queue, originalQueue, currentSong, currentIndex } = get();

        if (!isShuffled) {
            // turning ON: snapshot the current order, keep the current song first,
            // and shuffle everything after it
            const base = originalQueue.length ? originalQueue : queue;
            const rest = base.filter(s => s._id !== currentSong?._id);
            const shuffled = shuffleArray(rest);

            set({
                isShuffled: true,
                originalQueue: base,
                queue: currentSong ? [currentSong, ...shuffled] : shuffled,
                currentIndex: currentSong ? 0 : currentIndex,
            });
        } else {
            // turning OFF: restore the original order and re-point at the current song
            const restored = originalQueue.length ? originalQueue : queue;
            const idx = currentSong
                ? restored.findIndex(s => s._id === currentSong._id)
                : currentIndex;

            set({
                isShuffled: false,
                queue: restored,
                currentIndex: idx === -1 ? 0 : idx,
            });
        }
    },

    playNext: () => {
        const { currentIndex, queue } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex];
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            });
        } else {
            set({ isPlaying: false });
        }
    },

    playPrevious: () => {
        const { currentIndex, queue } = get();
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
            const prevSong = queue[prevIndex];

            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true,
            });
        } else {
            // no previous song
            set({ isPlaying: false });
        }
    },
}));