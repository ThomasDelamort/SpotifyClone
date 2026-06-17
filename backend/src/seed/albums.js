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
				title: "I'd Do Anything (feat. Mark Hoppus)",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781449689/01_-_I_d_Do_Anything_pv21no.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 197,
			},
			{
				title: "The Worst Day Ever",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781449970/02_-_The_Worst_Day_Ever_ilmob7.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 207,
			},
			{
				title: "You Don't Mean Anything (feat. Joel Madden)",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781449730/03_-_You_Don_t_Mean_Anything_hpuuqm.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 148,
			},
			{
				title: "I'm Just a Kid",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781449846/04_-_I_m_Just_a_Kid_e9llr7.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 198,
			},
			{
				title: "When I'm With You",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781449802/05_-_When_I_m_with_You_jjrqqy.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 157,
			},
			{
				title: "Meet You There",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450016/06_-_Meet_You_There_qzf7a1.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 253,
			},
			{
				title: "Addicted",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450021/07_-_Addicted_ne3o1q.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 232,
			},
			{
				title: "My Alien",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450263/08_-_My_Alien_p3g2rq.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 188,
			},
			{
				title: "God Must Hate Me",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450051/09_-_God_Must_Hate_Me_wibkjj.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 164,
			},
			{
				title: "I Won't Be There",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450081/10_-_I_Won_t_Be_There_r6uwjm.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 189,
			},
			{
				title: "One Day",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450235/11_-_One_Day_dbpy4n.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 194,
			},
			{
				title: "Perfect",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450272/12_-_Perfect_gkh6as.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 277,
			},
			// Bonus track on some editions — uncomment to include
			{
				title: "Grow Up",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				audioUrl: "https://res.cloudinary.com/dzaxbhml4/video/upload/v1781450235/13_-_Grow_Up_lkopd5.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 152,
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				title: "No Pads, No Helmets...Just Balls",
				artist: "Simple Plan",
				imageUrl: "https://res.cloudinary.com/dzaxbhml4/image/upload/v1781449506/ab67616d0000b273b7531c90a44e901a41242b69_so3yvy.jpg",
				releaseYear: 2002,
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