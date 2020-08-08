import mongoose from "mongoose";
import { Votes } from '../types/interfaces';

export type CommentDocument = mongoose.Document & {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    authorName: string;
    anonymous: boolean,
    movie: mongoose.Schema.Types.ObjectId;
    votes: Votes;
    createdAt: Date;
    UpdatedAt: Date;
};

const commentSchema = new mongoose.Schema({
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    authorName: {
        type: String,
        unique: false
    },
    anonymous: Boolean,
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }
}, { timestamps: true });

const upVote = function(_id: mongoose.Schema.Types.ObjectId) {
    if (_id != this.author)
        this.votes.up++;
    return this.save();
}

const downVote = function(_id: mongoose.Schema.Types.ObjectId) {
    if (_id != this.author)
        this.votes.down++;
    return this.save();
}

commentSchema.methods.upVote = upVote;
commentSchema.methods.downVote = downVote;

export const Comment = mongoose.model<CommentDocument>("Comment", commentSchema, "comments");
