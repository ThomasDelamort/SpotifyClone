import { User } from "../models/user.model.js";

export const findUserByClerkId = async (clerkId) => User.findOne({ clerkId });

export const createUser = async ({ clerkId, fullName, imageUrl }) =>
  User.create({ clerkId, fullName, imageUrl });
