import { Artist } from "../models/artist.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const getAllArtists = async () => Artist.find().sort({ name: 1 });

export const getArtistById = async (artistId) => Artist.findById(artistId);

export const getArtistSongsAndAlbums = async (artistId) => {
  const [songs, albums] = await Promise.all([
    Song.find({ artistId }).sort({ createdAt: -1 }),
    Album.find({ artistId }),
  ]);

  return { songs, albums };
};
