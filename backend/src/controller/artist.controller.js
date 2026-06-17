import { Artist } from "../models/artist.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const getAllArtists = async (req, res, next) => {
    try {
        const artists = await Artist.find().sort({ name: 1 });
        res.status(200).json(artists);
    } catch (err) {
        next(err);
    }
};

export const getArtistById = async (req, res, next) => {
    try {
        const { artistId } = req.params;

        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const [songs, albums] = await Promise.all([
            Song.find({ artistId }).sort({ createdAt: -1 }),
            Album.find({ artistId }),
        ]);

        res.status(200).json({ ...artist.toObject(), songs, albums });
    } catch (err) {
        next(err);
    }
};