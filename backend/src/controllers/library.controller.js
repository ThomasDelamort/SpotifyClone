import {
  getUserLibrary,
  findUserByClerkId,
  findAlbumById,
  findArtistById,
  toggleSavedAlbum as toggleSavedAlbumProvider,
  toggleSavedArtist as toggleSavedArtistProvider,
} from "../providers/library.provider.js";

// GET /api/library  → the signed-in user's saved library
// Returns a stable shape for all three sidebar pills. `playlists` stays empty
// until the User Playlists feature exists; `artists` fills in once "follow" does.
export const getMyLibrary = async (req, res, next) => {
  try {
    const user = await getUserLibrary(req.auth().userId);

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

    const album = await findAlbumById(albumId);
    if (!album) return res.status(404).json({ message: "Album not found" });

    const user = await findUserByClerkId(req.auth().userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const saved = await toggleSavedAlbumProvider(user, album);
    res.status(200).json({ saved });
  } catch (err) {
    next(err);
  }
};

// POST /api/library/artists/:artistId  → follow / unfollow an artist
export const toggleSavedArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;

    const artist = await findArtistById(artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    const user = await findUserByClerkId(req.auth().userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const saved = await toggleSavedArtistProvider(user, artist);
    res.status(200).json({ saved });
  } catch (err) {
    next(err);
  }
};
