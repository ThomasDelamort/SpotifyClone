import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    // one or more artists — supports features / collaborations
    artist: {
        type: [String],
        required: true,
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: "A song needs at least one artist",
        },
    },

    // references to the Artist collection — one per linked artist (alongside the `artist` names)
    artistId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
    }],

    imageUrl: {
        type: String,
        required: true,
    },

    audioUrl: {
        type: String,
        required: true,
    },

    duration: {
        type: Number,
        required: true,
    },

    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required: false,
    }
}, { timestamps: true });

export const Song = mongoose.model("Song", songSchema);