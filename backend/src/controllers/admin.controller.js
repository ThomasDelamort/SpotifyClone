import {
  createSong as createSongProvider,
  uploadToCloudinary,
  toArray,
  deleteSong as deleteSongProvider,
  createAlbum as createAlbumProvider,
  deleteAlbum as deleteAlbumProvider,
  findArtistByName,
  createArtist as createArtistProvider,
  deleteArtist as deleteArtistProvider,
  asFileArray,
  parseTracks,
  createAlbumRelease,
} from "../providers/admin.provider.js";

export const submitSong = async (req, res, next) => {
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

    const song = await createSongProvider(
      title,
      artists,
      toArray(artistId),
      audioUrl,
      imageUrl,
      duration,
      albumId,
    );

    res.status(201).json({
      ok: true,
      message: "Song created successfully",
      data: song,
    });
  } catch (err) {
    console.log("Error in submitSong", err);
    next(err);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await deleteSongProvider(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

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

    const album = await createAlbumProvider(
      title,
      artist,
      artistId,
      imageUrl,
      releaseYear,
    );

    res.status(201).json(album);
  } catch (err) {
    console.log("Error in createAlbum", err);
    next(err);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteAlbumProvider(id);

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

    const trimmedName = name.trim();
    const existing = await findArtistByName(trimmedName);
    if (existing) {
      return res
        .status(409)
        .json({ message: "An artist with that name already exists" });
    }

    let imageUrl;
    if (req.files && req.files.imageFile) {
      imageUrl = await uploadToCloudinary(req.files.imageFile);
    }

    const artist = await createArtistProvider(trimmedName, imageUrl);

    res.status(201).json(artist);
  } catch (err) {
    console.log("Error in createArtist", err);
    next(err);
  }
};

export const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artist = await deleteArtistProvider(id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

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

export const createRelease = async (req, res, next) => {
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

      const song = await createSongProvider(
        trackTitle,
        trackArtists.length > 0 ? trackArtists : releaseArtists,
        toArray(artistId),
        audioUrls[0],
        imageUrl,
        Number(track?.duration) || 0,
        null,
      );

      return res.status(201).json({ type: "single", song });
    }

    // --- album: one record, tracks attached in upload order ---
    const { album, songs } = await createAlbumRelease({
      title,
      releaseArtists,
      artistId,
      imageUrl,
      releaseYear,
      tracks,
      audioUrls,
    });

    res.status(201).json({ type: "album", album, songs });
  } catch (err) {
    console.log("Error in createRelease", err);
    next(err);
  }
};
