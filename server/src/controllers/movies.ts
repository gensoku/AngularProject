import { Movie } from '../models/Movie';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

interface MovieQuery {
    genre?: Object;
    sort?: Object;
}

export const getMovies = (req: Request, res: Response, next: NextFunction) => {
    let query: MovieQuery = {};
    if (req.query.genre)
        query.genre = { "$regex": req.query.genre, "$options": "i" }
    Movie.find(query, (err, movies)=> {
        if (err)
            next(err)
        else if (!movies)
            res.status(404).send()
        else
            res.status(200).send(movies)
    })
};

export const getMovieById = (req: Request, res: Response, next: NextFunction) => {
    Movie.findById(mongoose.Types.ObjectId(req.params.id)).exec((err, movies)=> {
        if (err)
            next(err)
        else if (!movies)
            res.status(404).send()
        else
            res.status(200).send(movies)       
    })
};

export const postComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Movie.findById(mongoose.Types.ObjectId(req.params.id)).exec().then((movies) => {
            if (!movies)
                throw new Error("not found");
        User.findOne({ username : req.body.username }).exec().then((_user) => {
            let { content, anonymous, username } = req.body
            var comment = new Comment({ anonymous, authorName: username, content, author: _user._id, movie: req.params.id, vote: { up: 0, down: 0}});
            comment.save().then((_comment) => {
                _user.comments.push(_comment._id);
                movies.comments.push(_comment._id);
                _user.save();
                movies.save();
                res.status(201).send(_comment);
            });
        })});
    } catch (error) {
        next(error);
    }
};

export const getCommentsByMovieId = (req: Request, res: Response, next: NextFunction) => {
    Movie.findById(mongoose.Types.ObjectId(req.params.id)).populate('comments').exec((err, movies)=> {
        if (err)
            next(err);
        else if (!movies)
            res.status(404).send();
        else
            res.status(200).send(movies.comments);
    })
};