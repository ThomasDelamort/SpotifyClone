import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";

// escape user input so it can't be interpreted as a regex
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const search = async (req, res, next) => {
    try {
        const q = (req.query.q || "").toString().trim();

        if (!q) {
            return res.status(200).json({ songs: [], albums: [], artists: [] });
        }

        const rx = new RegExp(escapeRegex(q), "i");

        const [songs, albums, artists] = await Promise.all([
            // song.artist is an array of names — { artist: rx } matches any element
            Song.find({ $or: [{ title: rx }, { artist: rx }] }).limit(12),
            Album.find({ $or: [{ title: rx }, { artist: rx }] }).limit(12),
            Artist.find({ name: rx }).limit(12),
        ]);

        res.status(200).json({ songs, albums, artists });
    } catch (err) {
        next(err);
    }
};