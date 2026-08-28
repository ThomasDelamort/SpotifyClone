import { User } from "../models/user.model.js";

export const getUsersExcept = async (clerkId) =>
  User.find({ clerkId: { $ne: clerkId } });
