// Standalone seed: One Direction — "Up All Night (The Souvenir Edition)" (2011), 18 tracks.
// Additive — it does NOT delete existing songs or albums.
//
// Run from the backend/ folder:   node src/seed/upAllNight.js
//
// Fill in your real Cloudinary URLs below:
//   - set ALBUM_COVER to the uploaded cover image URL
//   - replace each "REPLACE_WITH_AUDIO_URL" with that track's mp3 URL
// After running, `npm run backfill:artists` will create/link the "One Direction" artist.

import mongoose from "mongoose";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

// Load backend/.env regardless of the current working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../.env") });

const ALBUM_COVER = "REPLACE_WITH_ALBUM_COVER_URL";

const seedDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Check backend/.env.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // First, create all songs
    const createdSongs = await Song.insertMany([
      {
        title: "What Makes You Beautiful",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626982/01_-_What_Makes_You_Beautiful_wg22cr.mp3",
        duration: 200,
      },
      {
        title: "Gotta Be You",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626987/02_-_Gotta_Be_You_q0gd6o.mp3",
        duration: 245,
      },
      {
        title: "One Thing",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626972/03_-_One_Thing_sp3lvp.mp3",
        duration: 198,
      },
      {
        title: "More Than This",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626973/04_-_More_Than_This_l9hg7m.mp3",
        duration: 229,
      },
      {
        title: "Up All Night",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626935/05_-_Up_All_Night_lvq6f9.mp3",
        duration: 195,
      },
      {
        title: "I Wish",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626880/06_-_I_Wish_jzatb5.mp3",
        duration: 217,
      },
      {
        title: "Tell Me a Lie",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626801/07_-_Tell_Me_a_Lie_ymzocy.mp3",
        duration: 198,
      },
      {
        title: "Taken",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626673/08_-_Taken_kqgom2.mp3",
        duration: 238,
      },
      {
        title: "I Want",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626723/09_-_I_Want_vrjfpy.mp3",
        duration: 174,
      },
      {
        title: "Everything About You",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626734/10_-_Everything_About_You_j2joog.mp3",
        duration: 217,
      },
      {
        title: "Same Mistakes",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626473/11_-_Same_Mistakes_p0nwn4.mp3",
        duration: 219,
      },
      {
        title: "Save You Tonight",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626601/12_-_Save_You_Tonight_hpjw88.mp3",
        duration: 206,
      },
      {
        title: "Stole My Heart",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626468/13_-_Stole_My_Heart_yhrb96.mp3",
        duration: 206,
      },
      {
        title: "Stand Up",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782627866/14_-_Stand_Up_rqsb1u.mp3",
        duration: 175,
      },
      {
        title: "Moments",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626474/15_-_Moments_d2oua6.mp3x",
        duration: 263,
      },
      {
        title: "Another World",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626452/16_-_Another_World_hhkygj.mp3",
        duration: 204,
      },
      {
        title: "Na Na Na",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626651/17_-_Na_Na_Na_mev53y.mp3",
        duration: 186,
      },
      {
        title: "I Should Have Kissed You",
        artist: ["One Direction"],
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        audioUrl:
          "https://res.cloudinary.com/dzaxbhml4/video/upload/v1782626472/18_-_I_Should_Have_Kissed_You_yv5dts.mp3",
        duration: 216,
      },
    ]);

    // Create the album with references to song IDs
    const [album] = await Album.insertMany([
      {
        title: "Up All Night",
        artist: "One Direction",
        imageUrl:
          "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782627154/upAllNight_lt4xne.jpg",
        releaseYear: 2011,
        songs: createdSongs.map((song) => song._id),
      },
    ]);

    // Point each song back at the album
    await Song.updateMany(
      { _id: { $in: createdSongs.map((s) => s._id) } },
      { albumId: album._id },
    );

    console.log(
      `Seeded "Up All Night" (${createdSongs.length} songs) — album _id: ${album._id}`,
    );
    if (ALBUM_COVER.includes("REPLACE_WITH")) {
      console.log(
        "⚠  ALBUM_COVER is still a placeholder — set it to your real cover URL.",
      );
    }
    console.log(
      '⚠  Replace any remaining "REPLACE_WITH_AUDIO_URL" with real audio URLs.',
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
