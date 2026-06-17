import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (err) {
        console.log("Error in uploadToCloudinary", err);
        throw new Error("Error uploading to cloudinary");
    }
};

// normalize a field that may arrive as an array, a JSON array string, or a
// comma-separated string into a clean array of trimmed, non-empty values
const toArray = (value) => {
    if (value == null) return [];
    if (Array.isArray(value)) {
        return value.map((v) => `${v}`.trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[")) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.map((v) => `${v}`.trim()).filter(Boolean);
            } catch {
                // fall through to comma-splitting
            }
        }
        return trimmed.split(",").map((v) => v.trim()).filter(Boolean);
    }
    return [`${value}`];
};

export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files" });
        }

        const { title, artist, artistId, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const artists = toArray(artist);
        if (artists.length === 0) {
            return res.status(400).json({ message: "At least one artist is required" });
        }

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title,
            artist: artists,
            artistId: toArray(artistId),
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        });

        await song.save();

        // keep the field name consistent with deleteSong ($pull: { songs })
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id },
            });
        }

        res.status(201).json(song);
    } catch (err) {
        console.log("Error in createSong", err);
        next(err);
    }
};

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            });
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully." });
    } catch (err) {
        console.log("Error in deleteSong", err);
        next(err);
    }
};

export const createAlbum = async (req, res, next) => {
    try {
        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload an image file" });
        }

        const { title, artist, artistId, releaseYear } = req.body;
        const { imageFile } = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            artistId: artistId || null,
            imageUrl,
            releaseYear,
        });

        await album.save();

        res.status(201).json(album);
    } catch (err) {
        console.log("Error in createAlbum", err);
        next(err);
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;

        await Song.deleteMany({ albumId: id });
        await Album.findByIdAndDelete(id);

        res.status(200).json({ message: "Album deleted successfully" });
    } catch (err) {
        console.log("Error in deleteAlbum", err);
        next(err);
    }
};

export const createArtist = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Artist name is required" });
        }

        const existing = await Artist.findOne({ name: name.trim() });
        if (existing) {
            return res.status(409).json({ message: "An artist with that name already exists" });
        }

        let imageUrl;
        if (req.files && req.files.imageFile) {
            imageUrl = await uploadToCloudinary(req.files.imageFile);
        }

        const artist = new Artist({ name: name.trim(), imageUrl });
        await artist.save();

        res.status(201).json(artist);
    } catch (err) {
        console.log("Error in createArtist", err);
        next(err);
    }
};

export const deleteArtist = async (req, res, next) => {
    try {
        const { id } = req.params;

        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        // detach the reference from songs/albums but keep the legacy `artist` string(s) intact
        await Promise.all([
            Song.updateMany({ artistId: id }, { $pull: { artistId: id } }),
            Album.updateMany({ artistId: id }, { $set: { artistId: null } }),
        ]);

        await Artist.findByIdAndDelete(id);

        res.status(200).json({ message: "Artist deleted successfully" });
    } catch (err) {
        console.log("Error in deleteArtist", err);
        next(err);
    }
};

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true });
};