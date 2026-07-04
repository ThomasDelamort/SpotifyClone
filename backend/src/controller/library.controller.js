import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";

// GET /api/library  → the signed-in user's saved library
// Returns a stable shape for all three sidebar pills. `playlists` stays empty
// until the User Playlists feature exists; `artists` fills in once "follow" does.
export const getMyLibrary = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth().userId })
      .populate("savedAlbums")
      .populate("savedArtists");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      albums: user.savedAlbums,
      artists: user.savedArtists,
      playlists: [],
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/library/albums/:albumId  → toggle an album in the library
// Adds it if missing, removes it if present. Responds with { saved }.
export const toggleSavedAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ message: "Album not found" });

    const user = await User.findOne({ clerkId: req.auth().userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.savedAlbums.findIndex((id) => id.equals(albumId));

    let saved;
    if (index === -1) {
      user.savedAlbums.push(album._id);
      saved = true;
    } else {
      user.savedAlbums.splice(index, 1);
      saved = false;
    }

    await user.save();
    res.status(200).json({ saved });
  } catch (err) {
    next(err);
  }
};

// POST /api/library/artists/:artistId  → follow / unfollow an artist
export const toggleSavedArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;

    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    const user = await User.findOne({ clerkId: req.auth().userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.savedArtists.findIndex((id) => id.equals(artistId));

    let saved;
    if (index === -1) {
      user.savedArtists.push(artist._id);
      saved = true;
    } else {
      user.savedArtists.splice(index, 1);
      saved = false;
    }

    await user.save();
    res.status(200).json({ saved });
  } catch (err) {
    next(err);
  }
};
