import { findUserByClerkId, createUser } from "../providers/auth.provider.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    const user = await findUserByClerkId(id);

    if (!user) {
      await createUser({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`,
        imageUrl,
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("Error in auth callback", err);
    next(err);
  }
};
