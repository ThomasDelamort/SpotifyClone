import { Router } from "express";
import { getAllAlbums, getAlbumId } from "../controller/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumId);

export default router;