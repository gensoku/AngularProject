import mongoose from "mongoose";
import { CommentDocument } from  './Comment';

export type MovieDocument = mongoose.Document & {
    title: string;
    year: number;
    released: Date;
    runtime: number;
    genre: string;
    director: string;
    writer: string;
    actors: string[];
    plot: string;
    language: string;
    country: string;
    img: string;
    rating: string;
    type: string;
    comments: mongoose.Schema.Types.ObjectId[] | CommentDocument[];
};

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    released: Date,
    runtime: Number,
    genre: String,
    director: String,
    writer: String,
    actors: Array,
    plot: String,
    language: String,
    country: String,
    img: String,
    rating: String,
    type: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true });

export const Movie = mongoose.model<MovieDocument>("Movie", movieSchema, "Movies");
