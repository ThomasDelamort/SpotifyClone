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
				title: "Wake",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967040/01_-_Wake_yqkcl9.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 101,
			},
			{
				title: "Given Up",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967180/02_-_Given_Up_puvjri.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 189,
			},
			{
				title: "Leave Out All the Rest",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967165/03_-_Leave_Out_All_The_Rest_spr2ca.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 209,
			},
			{
				title: "Bleed It Out",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967174/04_-_Bleed_It_Out_uclt3l.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 164,
			},
			{
				title: "Shadow of the Day",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967212/05_-_Shadow_of_the_Day_p3istt.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 290,
			},
			{
				title: "What I've Done",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967205/06_-_What_I_ve_Done_tojrzo.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 205,
			},
			{
				title: "Hands Held High",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967158/07_-_Hands_Held_High_cdnclc.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 233,
			},
			{
				title: "No More Sorrow",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967276/08_-_No_More_Sorrow_dqhe20.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 222,
			},
			{
				title: "Valentine's Day",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967248/09_-_Valentine_s_Day_bzqkqj.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 197,
			},
			{
				title: "In Between",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967253/10_-_In_Between_nkl3m9.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 197,
			},
			{
				title: "In Pieces",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967281/11_-_In_Pieces_ook6ct.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 218,
			},
			{
				title: "The Little Things Give You Away",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1780967300/12_-_The_Little_Things_Give_You_Away_l7y5av.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 383,
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				title: "Minutes to Midnight",
				artist: "Linkin Park",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1780967004/ab67616d0000b2736e996745f2c7b8036abef213_qcocdi.jpg",
				releaseYear: 2007,
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