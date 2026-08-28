import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.get("/:userId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;