import { Song } from "../models/song.model.js";

const RANDOM_SONG_PROJECTION = {
  _id: 1,
  title: 1,
  artist: 1,
  imageUrl: 1,
  audioUrl: 1,
};

export const getAllSongs = async () => Song.find().sort({ createdAt: -1 });

export const getRandomSongs = async (size) =>
  Song.aggregate([{ $sample: { size } }, { $project: RANDOM_SONG_PROJECTION }]);

// A single has no album — the release *is* the song, and its own imageUrl is
// the cover art. `{ albumId: null }` also matches docs where the field is absent.
export const getSingles = async () =>
  Song.find({ albumId: null }).sort({ createdAt: -1 });
