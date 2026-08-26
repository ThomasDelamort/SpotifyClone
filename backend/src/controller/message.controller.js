import { Message } from "../models/message.model.js";
import { emitToUser } from "../lib/socket.js";

export const getMessages = async (req, res) => {
  try {
    const myId = req.auth().userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.auth().userId;
    const { receiverId, content } = req.body;

    const message = await Message.create({ senderId, receiverId, content });

    emitToUser(receiverId, "receive_message", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
