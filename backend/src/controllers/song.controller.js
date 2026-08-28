import {
  getAllSongs as getAllSongsProvider,
  getRandomSongs,
  getSingles as getSinglesProvider,
} from "../providers/song.provider.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await getAllSongsProvider();
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await getRandomSongs(6);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

export const getMadeForYou = async (req, res, next) => {
  try {
    const songs = await getRandomSongs(4);
    res.status(200).json(songs);
  } catch (err) {
    next(err);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await getRandomSongs(4);
    res.status(200).json(songs);
  } catch (err) {
    next(err);
  }
};

export const getSingles = async (req, res, next) => {
  try {
    const songs = await getSinglesProvider();
    res.status(200).json(songs);
  } catch (err) {
    next(err);
  }
};
