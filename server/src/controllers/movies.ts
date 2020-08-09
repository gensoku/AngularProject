import { Movie } from '../models/Movie';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import createError from 'http-errors';

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

        const movie = Movie.findById(mongoose.Types.ObjectId(req.params.id)).exec();
        const user = User.findOne({ username : req.body.username }).exec();
        await Promise.all([movie, user]).then((result) => {
            if (!result[1]) { return next(createError(401, "Invalid username", {expose: true})); }
            let { content, anonymous, username } = req.body
            var comment = new Comment({ anonymous, authorName: username, content, author: result[1]._id, movie: req.params.id, vote: { up: 0, down: 0}});
            comment.save().then((_comment) => {
                result[1].comments.push(_comment._id);
                result[0].comments.push(_comment._id);
                result[1].save();
                result[0].save();
                res.status(201).send(_comment);
            });
        });
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