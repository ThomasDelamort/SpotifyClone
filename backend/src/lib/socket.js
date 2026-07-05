import { Server } from "socket.io";

let _io;
const userSockets = new Map();

export const getIO = () => _io;

export const emitToUser = (clerkId, event, data) => {
    if (!_io) return;
    const socketId = userSockets.get(clerkId);
    if (socketId) _io.to(socketId).emit(event, data);
};

export const initializeSocket = (server) => {
    _io = new Server(server, {
        cors: process.env.NODE_ENV === "production"
            ? false
            : { origin: "http://localhost:3000", credentials: true },
    });

    const userActivities = new Map();

    _io.on("connection", (socket) => {
        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");

            _io.emit("user_connected", userId);
            socket.emit("users_online", Array.from(userSockets.keys()));
            _io.emit("activities", Array.from(userActivities.entries()));
        });

        socket.on("update_activity", ({ userId, activity }) => {
            console.log("activity updated", userId, activity);
            userActivities.set(userId, activity);
            _io.emit("activity_updated", { userId, activity });
        });

        socket.on("disconnect", () => {
            let disconnectedUserId;
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSockets.delete(userId);
                    userActivities.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                _io.emit("user_disconnected", disconnectedUserId);
            }
        });
    });
};