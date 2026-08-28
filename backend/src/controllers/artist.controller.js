import {
  getAllArtists as getAllArtistsProvider,
  getArtistById as getArtistByIdProvider,
  getArtistSongsAndAlbums,
} from "../providers/artist.provider.js";

export const getAllArtists = async (req, res, next) => {
  try {
    const artists = await getAllArtistsProvider();
    res.status(200).json(artists);
  } catch (err) {
    next(err);
  }
};

export const getArtistById = async (req, res, next) => {
  try {
    const { artistId } = req.params;

    const artist = await getArtistByIdProvider(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const { songs, albums } = await getArtistSongsAndAlbums(artistId);

    res.status(200).json({ ...artist.toObject(), songs, albums });
  } catch (err) {
    next(err);
  }
};
