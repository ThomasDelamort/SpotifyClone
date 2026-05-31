import { Router } from "express";
import router from "./user.route.js";

const routes = Router();

router.get("/", (req, res) => {
    res.send("Song route with GET method");
});

export default router;