// Exercises createRelease with the model layer and Cloudinary stubbed out, so
// the branching (single vs album), ordering, validation and rollback are all
// tested without a database or network.
import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";

// --- stub the models BEFORE the controller (and its model imports) load -----
let db;
const resetDb = () => {
  db = { songs: [], albums: [], deletedSongIds: [], deletedAlbumIds: [], failSongAt: -1 };
};
resetDb();

let oid = 0;
const nextId = () => `id_${++oid}`;

const SongStub = {
  create: async (doc) => {
    if (db.songs.length === db.failSongAt) throw new Error("boom: song create failed");
    const song = { ...doc, _id: nextId() };
    db.songs.push(song);
    return song;
  },
  deleteMany: async (filter) => {
    const ids = filter._id.$in;
    db.deletedSongIds.push(...ids);
    db.songs = db.songs.filter((s) => !ids.includes(s._id));
    return { acknowledged: true };
  },
};

const AlbumStub = {
  create: async (doc) => {
    const album = {
      ...doc,
      _id: nextId(),
      save: async () => album,
    };
    db.albums.push(album);
    return album;
  },
  findByIdAndDelete: async (id) => {
    db.deletedAlbumIds.push(id);
    db.albums = db.albums.filter((a) => a._id !== id);
    return null;
  },
};

const stubs = { Song: SongStub, Album: AlbumStub, Artist: {} };
mongoose.model = (name) => stubs[name] ?? {};

const cloudinary = (await import("../src/lib/cloudinary.js")).default;
let uploadCount = 0;
cloudinary.uploader.upload = async (tempFilePath) => {
  uploadCount += 1;
  return { secure_url: `https://cdn.test/${tempFilePath}` };
};

const { createRelease } = await import(
  "../src/controller/admin.controller.js"
);

// --- helpers ----------------------------------------------------------------
const file = (name) => ({ tempFilePath: name });

const run = async ({ files, body }) => {
  resetDb();
  uploadCount = 0;
  const res = {};
  const result = { status: 200, body: null, nextErr: null };
  res.status = (code) => {
    result.status = code;
    return res;
  };
  res.json = (payload) => {
    result.body = payload;
    return res;
  };
  await createRelease({ files, body }, res, (err) => {
    result.nextErr = err;
  });
  return result;
};

// --- tests ------------------------------------------------------------------
test("one track publishes a single with no album record", async () => {
  const r = await run({
    files: { imageFile: file("cover.jpg"), audioFiles: file("alright.mp3") },
    body: {
      title: "Alright",
      artist: "Kendrick Lamar",
      tracks: JSON.stringify([{ title: "Alright", artist: "", duration: 219 }]),
    },
  });

  assert.equal(r.status, 201);
  assert.equal(r.body.type, "single");
  assert.equal(db.albums.length, 0, "a single must not create an Album record");
  assert.equal(db.songs.length, 1);

  const song = db.songs[0];
  assert.equal(song.albumId, null);
  assert.equal(song.title, "Alright");
  assert.deepEqual(song.artist, ["Kendrick Lamar"], "falls back to the release artist");
  assert.equal(song.imageUrl, "https://cdn.test/cover.jpg", "cover becomes the single's art");
  assert.equal(song.duration, 219);
});

test("a lone audioFiles entry arrives as an object, not an array", async () => {
  // express-fileupload only gives an array when >1 file shares the field name
  const r = await run({
    files: { imageFile: file("c.jpg"), audioFiles: file("only.mp3") },
    body: { artist: "A", tracks: JSON.stringify([{ title: "Only", duration: 10 }]) },
  });
  assert.equal(r.status, 201);
  assert.equal(r.body.type, "single");
});

test("several tracks publish an album, in upload order, sharing one cover", async () => {
  const r = await run({
    files: {
      imageFile: file("nevermind.jpg"),
      audioFiles: [file("t1.mp3"), file("t2.mp3"), file("t3.mp3")],
    },
    body: {
      title: "Nevermind",
      artist: "Nirvana",
      releaseYear: "1991",
      tracks: JSON.stringify([
        { title: "Smells Like Teen Spirit", artist: "", duration: 301 },
        { title: "In Bloom", artist: "Nirvana, Guest", duration: 254 },
        { title: "Come As You Are", artist: "", duration: 219 },
      ]),
    },
  });

  assert.equal(r.status, 201);
  assert.equal(r.body.type, "album");
  assert.equal(db.albums.length, 1);
  assert.equal(db.songs.length, 3);

  const album = db.albums[0];
  assert.equal(album.title, "Nevermind");
  assert.equal(album.artist, "Nirvana");
  assert.equal(album.releaseYear, 1991);
  assert.equal(album.imageUrl, "https://cdn.test/nevermind.jpg");
  assert.equal(album.songs.length, 3, "album.songs is populated before saving");

  // order must survive: track N's audio is audioFiles[N]
  assert.deepEqual(
    db.songs.map((s) => s.audioUrl),
    ["https://cdn.test/t1.mp3", "https://cdn.test/t2.mp3", "https://cdn.test/t3.mp3"],
  );
  assert.deepEqual(db.songs.map((s) => s.title), [
    "Smells Like Teen Spirit",
    "In Bloom",
    "Come As You Are",
  ]);
  assert.ok(db.songs.every((s) => s.imageUrl === "https://cdn.test/nevermind.jpg"));
  assert.ok(db.songs.every((s) => s.albumId === album._id));

  // per-track artists override the release artist; blanks inherit it
  assert.deepEqual(db.songs[0].artist, ["Nirvana"]);
  assert.deepEqual(db.songs[1].artist, ["Nirvana", "Guest"], "features are split");
  assert.equal(uploadCount, 4, "one cover + three audio files");
});

test("rejects a release with no cover", async () => {
  const r = await run({
    files: { audioFiles: file("a.mp3") },
    body: { artist: "A", tracks: JSON.stringify([{ title: "A" }]) },
  });
  assert.equal(r.status, 400);
  assert.match(r.body.message, /cover artwork/i);
});

test("rejects a release with no tracks", async () => {
  const r = await run({ files: { imageFile: file("c.jpg") }, body: { artist: "A" } });
  assert.equal(r.status, 400);
  assert.match(r.body.message, /at least one track/i);
});

test("rejects mismatched track details and audio files", async () => {
  const r = await run({
    files: { imageFile: file("c.jpg"), audioFiles: [file("a.mp3"), file("b.mp3")] },
    body: { artist: "A", tracks: JSON.stringify([{ title: "Only one" }]) },
  });
  assert.equal(r.status, 400);
  assert.match(r.body.message, /don't match/i);
  assert.equal(uploadCount, 0, "nothing is uploaded when validation fails");
});

test("an album still requires a title and a release year", async () => {
  const two = [file("a.mp3"), file("b.mp3")];
  const tracks = JSON.stringify([{ title: "A" }, { title: "B" }]);

  const noTitle = await run({
    files: { imageFile: file("c.jpg"), audioFiles: two },
    body: { artist: "A", releaseYear: "2020", tracks },
  });
  assert.equal(noTitle.status, 400);
  assert.match(noTitle.body.message, /title/i);

  const noYear = await run({
    files: { imageFile: file("c.jpg"), audioFiles: two },
    body: { title: "T", artist: "A", tracks },
  });
  assert.equal(noYear.status, 400);
  assert.match(noYear.body.message, /release year/i);
});

test("a single needs neither a release year nor a separate title", async () => {
  const r = await run({
    files: { imageFile: file("c.jpg"), audioFiles: file("a.mp3") },
    body: { artist: "A", tracks: JSON.stringify([{ title: "Just The Track" }]) },
  });
  assert.equal(r.status, 201);
  assert.equal(db.songs[0].title, "Just The Track");
});

test("a failed track deletes the half-built album instead of leaving it behind", async () => {
  resetDb();
  db.failSongAt = 2; // the third Song.create throws
  const res = {
    status() { return res; },
    json() { return res; },
  };
  let forwarded = null;
  await createRelease(
    {
      files: {
        imageFile: file("c.jpg"),
        audioFiles: [file("a.mp3"), file("b.mp3"), file("c.mp3")],
      },
      body: {
        title: "Doomed",
        artist: "A",
        releaseYear: "2024",
        tracks: JSON.stringify([{ title: "A" }, { title: "B" }, { title: "C" }]),
      },
    },
    res,
    (err) => { forwarded = err; },
  );

  assert.ok(forwarded, "the error is handed to the express error handler");
  assert.equal(db.albums.length, 0, "the album is rolled back");
  assert.equal(db.songs.length, 0, "the tracks written before the failure are rolled back");
  assert.equal(db.deletedAlbumIds.length, 1);
  assert.equal(db.deletedSongIds.length, 2);
});

test("refuses a truncated upload instead of storing a corrupt track", async () => {
  // express-fileupload sets `truncated` rather than erroring when a file
  // exceeds limits.fileSize, so an oversized track would otherwise be
  // uploaded to Cloudinary half-written.
  const big = { tempFilePath: "big.mp3", name: "big.mp3", truncated: true };
  const r = await run({
    files: { imageFile: file("c.jpg"), audioFiles: [file("a.mp3"), big] },
    body: {
      title: "T",
      artist: "A",
      releaseYear: "2024",
      tracks: JSON.stringify([{ title: "A" }, { title: "B" }]),
    },
  });

  assert.equal(r.status, 413);
  assert.match(r.body.message, /big\.mp3/);
  assert.equal(uploadCount, 0, "nothing reaches Cloudinary");
  assert.equal(db.songs.length, 0);
});
