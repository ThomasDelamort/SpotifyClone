import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMyLibrary,
  toggleSavedAlbum,
  toggleSavedArtist,
} from "../controllers/library.controller.js";

const router = Router();

router.get("/", protectRoute, getMyLibrary);
router.post("/albums/:albumId", protectRoute, toggleSavedAlbum);
router.post("/artists/:artistId", protectRoute, toggleSavedArtist);

export default router;
