import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing data
        // await Album.deleteMany({});
        // await Song.deleteMany({});

        // First, create all songs
        const createdSongs = await Song.insertMany([
            {
                title: "Smells Like Teen Spirit",
                artist: "Nirvana",
                imageUrl: "/albums/Nevermind.jpg",
                audioUrl: "/songs/SmellsLikeTeenSpirit.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 303,
            },
            {
                title: "In Bloom",
                artist: "Nirvana",
                imageUrl: "/albums/Nevermind.jpg",
                audioUrl: "/songs/InBloom.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 255,
            },
            {
                title: "Come As You Are",
                artist: "Nirvana",
                imageUrl: "/albums/Nevermind.jpg",
                audioUrl: "/songs/ComeAsYouAre.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 220,
            },
            {
                title: "Breed",
                artist: "Nirvana",
                imageUrl: "/albums/Nevermind.jpg",
                audioUrl: "/songs/Breed.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 184,
            },
            {
                title: "Lithium",
                artist: "Nirvana",
                imageUrl: "/albums/Nevermind.jpg",
                audioUrl: "/songs/Lithium.mp3",
                plays: Math.floor(Math.random() * 5000),
                duration: 258,
            },
        ]);

        // Create albums with references to song IDs
        const albums = [
            {
                title: "Nevermind",
                artist: "Nirvana",
                imageUrl: "/albums/Nevermind.jpg",
                releaseYear: 1991,
                songs: createdSongs.slice(0, 4).map((song) => song._id),
            },
        ];

        // Insert all albums
        const createdAlbums = await Album.insertMany(albums);

        // Update songs with their album references
        for (let i = 0; i < createdAlbums.length; i++) {
            const album = createdAlbums[i];
            const albumSongs = albums[i].songs;

            await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
        }

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();