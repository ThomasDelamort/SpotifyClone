import { Album } from "../models/album.model.js";

export const getAllAlbums = async () => Album.find();

export const getAlbumById = async (albumId) =>
  Album.findById(albumId).populate("songs");
