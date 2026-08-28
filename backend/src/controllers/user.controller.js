import { getUsersExcept } from "../providers/user.provider.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth().userId;
    const users = await getUsersExcept(currentUserId);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
