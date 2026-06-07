import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
    {
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        imageUrl: "/albums/Nevermind.jpg",
        audioUrl: "/songs/SmellsLikeTeenSpirit.mp3",
        duration: 303, // 0:46
    },
    {
        title: "In Bloom",
        artist: "Nirvana",
        imageUrl: "/albums/Nevermind.jpg",
        audioUrl: "/songs/InBloom.mp3",
        duration: 255, // 0:41
    },
];

const seedSongs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing songs
        // await Song.deleteMany({});

        // Insert new songs
        await Song.insertMany(songs);

        console.log("Songs seeded successfully!");
    } catch (error) {
        console.error("Error seeding songs:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedSongs();