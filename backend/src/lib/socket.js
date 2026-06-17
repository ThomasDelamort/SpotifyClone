import { Server } from "socket.io";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    const userSockets = new Map();
    const userActivities = new Map();

    io.on("connection", (socket) => {
        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");


            io.emit("user_connected", userId);

            socket.emit("users_online", Array.from(userSockets.keys()));

            io.emit("activities", Array.from(userActivities.entries()));
        });

        socket.on("update_activity", ({ userId, activity }) => {
            console.log("activity updated", userId, activity);
            userActivities.set(userId, activity);
            io.emit("activity_updated", { userId, activity });
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
                io.emit("user_disconnected", disconnectedUserId);
            }
        });
    });
};