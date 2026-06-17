import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    artist: {
        type: String,
        required: true,
    },

    // reference to the Artist collection — added alongside the legacy `artist` string
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: false,
    },

    imageUrl: {
        type: String,
        required: true,
    },

    releaseYear: {
        type: Number,
        required: true,
    },

    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
    }]
});

export const Album = mongoose.model("Album", albumSchema);