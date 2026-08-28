import {
  getConversation,
  createMessage,
} from "../providers/message.provider.js";

export const getMessages = async (req, res) => {
  try {
    const myId = req.auth().userId;
    const { userId } = req.params;

    const messages = await getConversation(myId, userId);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.auth().userId;
    const { receiverId, content } = req.body;

    const message = await createMessage(senderId, receiverId, content);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
