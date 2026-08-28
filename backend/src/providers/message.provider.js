import { Message } from "../models/message.model.js";
import { emitToUser } from "../lib/socket.js";

export const getConversation = async (userAId, userBId) =>
  Message.find({
    $or: [
      { senderId: userAId, receiverId: userBId },
      { senderId: userBId, receiverId: userAId },
    ],
  }).sort({ createdAt: 1 });

export const createMessage = async (senderId, receiverId, content) => {
  const message = await Message.create({ senderId, receiverId, content });
  emitToUser(receiverId, "receive_message", message);
  return message;
};
