import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
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

const toArray = (value) => {
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

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, artistId, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const artists = toArray(artist);
    if (artists.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one artist is required" });
    }

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist: artists,
      artistId: toArray(artistId),
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

    res.status(201).json(song);
  } catch (err) {
    console.log("Error in createSong", err);
    next(err);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully." });
  } catch (err) {
    console.log("Error in deleteSong", err);
    next(err);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    const { title, artist, artistId, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      artistId: artistId || null,
      imageUrl,
      releaseYear,
    });

    await album.save();

    res.status(201).json(album);
  } catch (err) {
    console.log("Error in createAlbum", err);
    next(err);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (err) {
    console.log("Error in deleteAlbum", err);
    next(err);
  }
};

export const createArtist = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Artist name is required" });
    }

    const existing = await Artist.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An artist with that name already exists" });
    }

    let imageUrl;
    if (req.files && req.files.imageFile) {
      imageUrl = await uploadToCloudinary(req.files.imageFile);
    }

    const artist = new Artist({ name: name.trim(), imageUrl });
    await artist.save();

    res.status(201).json(artist);
  } catch (err) {
    console.log("Error in createArtist", err);
    next(err);
  }
};

export const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // detach the reference from songs/albums but keep the legacy `artist` string(s) intact
    await Promise.all([
      Song.updateMany({ artistId: id }, { $pull: { artistId: id } }),
      Album.updateMany({ artistId: id }, { $set: { artistId: null } }),
    ]);

    await Artist.findByIdAndDelete(id);

    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (err) {
    console.log("Error in deleteArtist", err);
    next(err);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};

// --- releases ---------------------------------------------------------------
// A "release" is what an admin actually uploads: one cover plus one or more
// tracks. Two or more tracks become an Album. A lone track is a single, which
// this catalogue stores as a Song with no albumId — there is no Album record,
// and the cover uploaded here becomes the song's own artwork.

const asFileArray = (files) => {
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};

const parseTracks = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const createRelease = async (req, res, next) => {
  // track what we persist so a mid-flight failure doesn't leave a half-built release
  const created = { songIds: [], albumId: null };

  try {
    const imageFile = req.files?.imageFile;
    const audioFiles = asFileArray(req.files?.audioFiles);

    if (!imageFile) {
      return res.status(400).json({ message: "Please upload cover artwork" });
    }
    if (audioFiles.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one track" });
    }

    // express-fileupload runs with abortOnLimit off, so anything over the
    // configured fileSize arrives silently truncated. Uploading that to
    // Cloudinary would store a corrupt track, so refuse it loudly instead.
    const truncated = [imageFile, ...audioFiles].filter(
      (file) => file.truncated,
    );
    if (truncated.length > 0) {
      return res.status(413).json({
        message: `Too large, and uploaded incomplete: ${truncated
          .map((file) => file.name)
          .join(", ")}`,
      });
    }

    const { title, artist, artistId, releaseYear } = req.body;
    const tracks = parseTracks(req.body.tracks);

    if (tracks.length !== audioFiles.length) {
      return res.status(400).json({
        message: `Track details (${tracks.length}) don't match uploaded audio files (${audioFiles.length})`,
      });
    }

    const releaseArtists = toArray(artist);
    if (releaseArtists.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one artist is required" });
    }

    const isSingle = audioFiles.length === 1;

    if (!isSingle) {
      if (!`${title || ""}`.trim()) {
        return res.status(400).json({ message: "An album needs a title" });
      }
      if (!releaseYear) {
        return res
          .status(400)
          .json({ message: "An album needs a release year" });
      }
    }

    // one cover for the whole release — every track inherits it
    const imageUrl = await uploadToCloudinary(imageFile);
    const audioUrls = await Promise.all(
      audioFiles.map((file) => uploadToCloudinary(file)),
    );

    // --- single: the song is the release, so no Album record is created ---
    if (isSingle) {
      const [track] = tracks;
      const trackTitle = `${track?.title || title || ""}`.trim();

      if (!trackTitle) {
        return res.status(400).json({ message: "A single needs a title" });
      }

      const trackArtists = toArray(track?.artist);

      const song = await Song.create({
        title: trackTitle,
        artist: trackArtists.length > 0 ? trackArtists : releaseArtists,
        artistId: toArray(artistId),
        imageUrl,
        audioUrl: audioUrls[0],
        duration: Number(track?.duration) || 0,
        albumId: null,
      });

      return res.status(201).json({ type: "single", song });
    }

    // --- album: one record, tracks attached in upload order ---
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

    res.status(201).json({ type: "album", album, songs });
  } catch (err) {
    if (created.songIds.length > 0) {
      await Song.deleteMany({ _id: { $in: created.songIds } }).catch(() => {});
    }
    if (created.albumId) {
      await Album.findByIdAndDelete(created.albumId).catch(() => {});
    }

    console.log("Error in createRelease", err);
    next(err);
  }
};
