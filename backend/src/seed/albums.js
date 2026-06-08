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
				title: "Cave In",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924719/01_-_Cave_In_Album_Version_slflqu.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 242,
			},
			{
				title: "The Bird and the Worm",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924760/02_-_The_Bird_And_The_Worm_i2wtlz.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 207,
			},
			{
				title: "Hello Seattle",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924764/03_-_Hello_Seattle_asdmew.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 167,
			},
			{
				title: "Umbrella Beach",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924773/04_-_Umbrella_Beach_Album_Version_ca5plg.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 230,
			},
			{
				title: "The Saltwater Room",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924808/05_-_The_Saltwater_Room_wyzwkd.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 242,
			},
			{
				title: "Dental Care",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924825/06_-_Dental_Care_Album_Version_yarcx2.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 191,
			},
			{
				title: "Meteor Shower",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924811/07_-_Meteor_Shower_Album_Version_mblqwu.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 134,
			},
			{
				title: "On the Wing",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924850/08_-_On_The_Wing_i3pizo.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 301,
			},
			{
				title: "Fireflies",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924782/09_-_Fireflies_uwkfyv.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 228,
			},
			{
				title: "The Tip of the Iceberg",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924741/10_-_The_Tip_Of_The_Iceberg_Album_Version_nvinzz.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 203,
			},
			{
				title: "Vanilla Twilight",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924853/11_-_Vanilla_Twilight_lsw9md.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 232,
			},
			{
				title: "Tidal Wave",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780924851/12_-_Tidal_Wave_Album_Version_esijjf.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 190,
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				title: "Ocean Eyes",
				artist: "Owl City",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780924547/ab67616d0000b273785d4e702802da500fc78b32_q7usx6.jpg",
				releaseYear: 2009,
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