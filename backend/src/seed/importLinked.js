import mongoose from "mongoose";
import { config } from "dotenv";
import { EJSON } from "bson";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// load backend/.env explicitly so this works no matter which folder you run it from
config({ path: path.resolve(__dirname, "../../.env") });

// reads MongoDB extended-JSON ($oid/$date) and returns real ObjectId/Date types
const readEJSON = (file) =>
    EJSON.parse(fs.readFileSync(path.join(__dirname, file), "utf8"));

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection;
        console.log("Connected.");

        const songs = readEJSON("spotify_db.songs.linked.json");
        const albums = readEJSON("spotify_db.albums.linked.json");

        // wipe ONLY songs + albums — artists are left untouched (their _ids are referenced)
        await db.collection("songs").deleteMany({});
        await db.collection("albums").deleteMany({});
        console.log("Cleared songs + albums.");

        // raw inserts preserve the original _ids, timestamps, and relationships
        if (songs.length) await db.collection("songs").insertMany(songs);
        if (albums.length) await db.collection("albums").insertMany(albums);

        console.log(`Imported ${songs.length} songs and ${albums.length} albums.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Import failed:", err);
        process.exit(1);
    }
};

run();