import { Router } from "express";
import {
    createSong,
    deleteSong,
    createAlbum,
    deleteAlbum,
    createArtist,
    deleteArtist,
    createRelease,
    checkAdmin,
} from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);

// cover + one or more tracks in a single upload: many tracks -> album, one -> single
router.post("/releases", createRelease);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

router.post("/artists", createArtist);
router.delete("/artists/:id", deleteArtist);

export default router;
