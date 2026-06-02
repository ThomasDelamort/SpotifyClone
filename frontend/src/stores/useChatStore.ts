import { create } from 'zustand';
import {axiosInstance} from "@/lib/axios.ts";

interface ChatStore {
    users: any[];
    fetchUsers: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers : async() => {
        set({ isLoading: true, error: null});
        try {
            const response = await axiosInstance.get("/users");
            set({ users: response.data });
        } catch (err: any) {
            set({ error: err.resonse.data.message });
        }
    },
}));