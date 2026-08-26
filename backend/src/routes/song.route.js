import { Router } from "express";
import {
    getAllSongs,
    getFeaturedSongs,
    getMadeForYou,
    getTrendingSongs,
    getSingles,
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/singles", getSingles);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYou);
router.get("/trending", getTrendingSongs);

export default router;
