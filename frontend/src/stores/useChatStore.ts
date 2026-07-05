import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import type { AxiosError } from "axios";
import { create } from "zustand";
import { io, type Socket } from "socket.io-client";

interface ChatStore {
    users: User[];
    messages: Message[];
    selectedUser: User | null;
    isLoading: boolean;
    error: string | null;
    socket: Socket;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;

    fetchUsers: () => Promise<void>;
    fetchMessages: (userId: string) => Promise<void>;
    sendMessage: (receiverId: string, senderId: string, content: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    initSocket: (userId: string) => void;
    disconnectSocket: () => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
    autoConnect: false,
    withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/users");
            set({ users: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMessages: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    sendMessage: async (receiverId, _senderId, content) => {
        try {
            const response = await axiosInstance.post("/messages", { receiverId, content });
            set((state) => ({ messages: [...state.messages, response.data] }));
        } catch (error) {
            set({ error: (error as AxiosError<{ message: string }>).response?.data.message });
        }
    },

    setSelectedUser: (user) => set({ selectedUser: user, messages: [] }),

    initSocket: (userId) => {
        if (!get().isConnected) {
            socket.auth = { userId };
            socket.connect();

            socket.emit("user_connected", userId);

            socket.on("users_online", (users: string[]) => {
                set({ onlineUsers: new Set(users) });
            });

            socket.on("activities", (activities: [string, string][]) => {
                set({ userActivities: new Map(activities) });
            });

            socket.on("user_connected", (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId]),
                }));
            });

            socket.on("user_disconnected", (userId: string) => {
                set((state) => {
                    const newOnlineUsers = new Set(state.onlineUsers);
                    newOnlineUsers.delete(userId);
                    return { onlineUsers: newOnlineUsers };
                });
            });

            socket.on("activity_updated", ({ userId, activity }) => {
                set((state) => {
                    const newActivities = new Map(state.userActivities);
                    newActivities.set(userId, activity);
                    return { userActivities: newActivities };
                });
            });

            socket.on("receive_message", (message: Message) => {
                set((state) => ({ messages: [...state.messages, message] }));
            });

            set({ isConnected: true });
        }
    },

    disconnectSocket: () => {
        if (get().isConnected) {
            socket.disconnect();
            set({ isConnected: false });
        }
    },
}));