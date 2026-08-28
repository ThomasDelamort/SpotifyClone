import cloudinary from "../lib/cloudinary.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";

export const uploadToCloudinary = async (file) => {
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

export const toArray = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.map((v) => `${v}`.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed))
          return parsed.map((v) => `${v}`.trim()).filter(Boolean);
      } catch {
        // fall through to comma-splitting
      }
    }
    return trimmed
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [`${value}`];
};

export const createSong = async (
  title,
  artist,
  artistId,
  audioUrl,
  imageUrl,
  duration,
  albumId,
) => {
  const song = new Song({
    title,
    artist,
    artistId,
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

  return song;
};

export const deleteSong = async (id) => {
  const song = await Song.findById(id);
  if (!song) return null;

  if (song.albumId) {
    await Album.findByIdAndUpdate(song.albumId, {
      $pull: { songs: song._id },
    });
  }

  await Song.findByIdAndDelete(id);
  return song;
};

export const createAlbum = async (
  title,
  artist,
  artistId,
  imageUrl,
  releaseYear,
) => {
  const album = new Album({
    title,
    artist,
    artistId: artistId || null,
    imageUrl,
    releaseYear,
  });

  await album.save();
  return album;
};

export const deleteAlbum = async (id) => {
  await Song.deleteMany({ albumId: id });
  await Album.findByIdAndDelete(id);
};

export const findArtistByName = async (name) => Artist.findOne({ name });

export const createArtist = async (name, imageUrl) => {
  const artist = new Artist({ name, imageUrl });
  await artist.save();
  return artist;
};

export const deleteArtist = async (id) => {
  const artist = await Artist.findById(id);
  if (!artist) return null;

  // detach the reference from songs/albums but keep the legacy `artist` string(s) intact
  await Promise.all([
    Song.updateMany({ artistId: id }, { $pull: { artistId: id } }),
    Album.updateMany({ artistId: id }, { $set: { artistId: null } }),
  ]);

  await Artist.findByIdAndDelete(id);
  return artist;
};

export const asFileArray = (files) => {
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};

export const parseTracks = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const createAlbumRelease = async ({
  title,
  releaseArtists,
  artistId,
  imageUrl,
  releaseYear,
  tracks,
  audioUrls,
}) => {
  // track what we persist so a mid-flight failure doesn't leave a half-built release
  const created = { songIds: [], albumId: null };

  try {
    const album = await Album.create({
      title: `${title}`.trim(),
      // Album.artist is a single string; Song.artist is a list
      artist: releaseArtists.join(", "),
      artistId: artistId || null,
      imageUrl,
      releaseYear: Number(releaseYear),
    });
    created.albumId = album._id;

    // allSettled, not all: if one track fails we still need the ids of the
    // ones that landed, otherwise the rollback below leaves them orphaned
    // pointing at an album it just deleted.
    const results = await Promise.allSettled(
      tracks.map((track, i) => {
        const trackArtists = toArray(track?.artist);
        return Song.create({
          title: `${track?.title || `Track ${i + 1}`}`.trim(),
          artist: trackArtists.length > 0 ? trackArtists : releaseArtists,
          artistId: toArray(artistId),
          imageUrl,
          audioUrl: audioUrls[i],
          duration: Number(track?.duration) || 0,
          albumId: album._id,
        });
      }),
    );

    const songs = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    created.songIds = songs.map((song) => song._id);

    const failed = results.find((result) => result.status === "rejected");
    if (failed) throw failed.reason;

    album.songs = created.songIds;
    await album.save();

    return { album, songs };
  } catch (err) {
    if (created.songIds.length > 0) {
      await Song.deleteMany({ _id: { $in: created.songIds } }).catch(
        () => {},
      );
    }
    if (created.albumId) {
      await Album.findByIdAndDelete(created.albumId).catch(() => {});
    }
    throw err;
  }
};
