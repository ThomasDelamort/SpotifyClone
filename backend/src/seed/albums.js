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
				title: "The 1975",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 250,
			},
			{
				title: "Happiness",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 303,
			},
			{
				title: "Looking for Somebody (To Love)",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 178,
			},
			{
				title: "Part of the Band",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 260,
			},
			{
				title: "Oh Caroline",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 212,
			},
			{
				title: "I'm in Love with You",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 262,
			},
			{
				title: "All I Need to Hear",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 210,
			},
			{
				title: "Wintering",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 165,
			},
			{
				title: "Human Too",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 224,
			},
			{
				title: "About You",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 326,
			},
			{
				title: "When We Are Together",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				audioUrl: "REPLACE_WITH_AUDIO_URL",
				plays: Math.floor(Math.random() * 5000),
				duration: 216,
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				title: "Being Funny in a Foreign Language",
				artist: "The 1975",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1782012165/images_fjxt2f.jpg",
				releaseYear: 2022,
				songs: createdSongs.map((song) => song._id),
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