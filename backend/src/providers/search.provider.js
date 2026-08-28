import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";

// escape user input so it can't be interpreted as a regex
export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchCatalog = async (query) => {
  const rx = new RegExp(escapeRegex(query), "i");

  const [songs, albums, artists] = await Promise.all([
    // song.artist is an array of names — { artist: rx } matches any element
    Song.find({ $or: [{ title: rx }, { artist: rx }] }).limit(12),
    Album.find({ $or: [{ title: rx }, { artist: rx }] }).limit(12),
    Artist.find({ name: rx }).limit(12),
  ]);

  return { songs, albums, artists };
};
