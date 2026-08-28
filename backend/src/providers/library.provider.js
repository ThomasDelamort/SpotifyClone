import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";

export const getUserLibrary = async (clerkId) =>
  User.findOne({ clerkId }).populate("savedAlbums").populate("savedArtists");

export const findUserByClerkId = async (clerkId) => User.findOne({ clerkId });

export const findAlbumById = async (albumId) => Album.findById(albumId);

export const findArtistById = async (artistId) => Artist.findById(artistId);

export const toggleSavedAlbum = async (user, album) => {
  const index = user.savedAlbums.findIndex((id) => id.equals(album._id));

  let saved;
  if (index === -1) {
    user.savedAlbums.push(album._id);
    saved = true;
  } else {
    user.savedAlbums.splice(index, 1);
    saved = false;
  }

  await user.save();
  return saved;
};

export const toggleSavedArtist = async (user, artist) => {
  const index = user.savedArtists.findIndex((id) => id.equals(artist._id));

  let saved;
  if (index === -1) {
    user.savedArtists.push(artist._id);
    saved = true;
  } else {
    user.savedArtists.splice(index, 1);
    saved = false;
  }

  await user.save();
  return saved;
};
