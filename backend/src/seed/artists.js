import mongoose from "mongoose";
import { config } from "dotenv";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";

config();

// Replace with a real artist photo per artist later (e.g. via the admin create-artist endpoint).
const PLACEHOLDER_IMAGE = "";

// Every artist in the catalog: the primary artists plus the ones featured in song titles.
const ARTIST_NAMES = [
    // primary artists
    "Bazzi",
    "Justin Bieber",
    "LANY",
    "Linkin Park",
    "Nirvana",
    "One Direction",
    "OneRepublic",
    "Owl City",
    "Simple Plan",
    // featured artists (pulled from "(feat. ...)" in song titles)
    "Usher",
    "Camila Cabello",
    "Pusha T",
    "Stormzy",
    "Kiiara",
    "Mark Hoppus",
    "Joel Madden",
];

// Maps a song (by exact title) to the artists featured on it, so they can be
// linked into that song's artist / artistId arrays in addition to the main artist.
const FEATURES = [
    { title: "First Dance (feat. Usher)", featured: ["Usher"] },
    { title: "Beautiful (feat. Camila Cabello)", featured: ["Camila Cabello"] },
    { title: "Good Goodbye (feat. Pusha T & Stormzy)", featured: ["Pusha T", "Stormzy"] },
    { title: "Heavy (feat. Kiiara)", featured: ["Kiiara"] },
    { title: "I'd Do Anything (feat. Mark Hoppus)", featured: ["Mark Hoppus"] },
    { title: "You Don't Mean Anything (feat. Joel Madden)", featured: ["Joel Madden"] },
];

const seedArtists = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected. Seeding artists...");

        // 1. Ensure existing songs use the array shape for `artist` / `artistId`.
        //    Runs server-side, so songs imported as raw strings are handled safely.
        await Song.updateMany({}, [
            {
                $set: {
                    artist: {
                        $cond: [{ $isArray: "$artist" }, "$artist", ["$artist"]],
                    },
                    artistId: {
                        $let: {
                            vars: { a: { $ifNull: ["$artistId", []] } },
                            in: { $cond: [{ $isArray: "$$a" }, "$$a", ["$$a"]] },
                        },
                    },
                },
            },
        ], { updatePipeline: true });

        // 2. Upsert every artist (curated names + any extra names found in the catalog).
        const songArtists = await Song.distinct("artist");
        const albumArtists = await Album.distinct("artist");
        const allNames = [...new Set(
            [...ARTIST_NAMES, ...songArtists, ...albumArtists]
                .filter(Boolean)
                .map((n) => `${n}`.trim())
                .filter(Boolean)
        )];

        const nameToId = new Map();
        let created = 0;

        for (const name of allNames) {
            let artist = await Artist.findOne({ name });
            if (!artist) {
                artist = await Artist.create({ name, imageUrl: PLACEHOLDER_IMAGE });
                created++;
            }
            nameToId.set(name, artist._id);
        }

        // 3. Link primary artists by name: songs (array refs), albums (single ref).
        for (const [name, id] of nameToId) {
            await Promise.all([
                Song.updateMany({ artist: name }, { $addToSet: { artistId: id } }),
                Album.updateMany({ artist: name }, { $set: { artistId: id } }),
            ]);
        }

        // 4. Link featured artists into their specific songs (names + refs).
        let featLinks = 0;
        for (const { title, featured } of FEATURES) {
            const names = featured.filter((n) => nameToId.has(n));
            const ids = names.map((n) => nameToId.get(n));
            if (names.length === 0) continue;

            const result = await Song.updateMany(
                { title },
                { $addToSet: { artist: { $each: names }, artistId: { $each: ids } } }
            );
            featLinks += result.modifiedCount || 0;
        }

        console.log(`Done. ${allNames.length} artist(s) processed, ${created} newly created, ${featLinks} feature link(s).`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Artist seed failed:", err);
        process.exit(1);
    }
};

seedArtists();