import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    imageUrl: {
        type: String,
    },
}, { timestamps: true });

export const Artist = mongoose.model("Artist", artistSchema);