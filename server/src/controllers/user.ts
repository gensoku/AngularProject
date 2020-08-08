import passport from "passport";
import { User, UserDocument  } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { WriteError } from "mongodb";
import { check, validationResult } from "express-validator";
import "../config/passport";

/**
 * SessionLess auth
 */


export const login = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("basic",{session: false}, (err: Error, user: UserDocument) => {
        if (err) { return next(err); }
        if (!user) {
            res.status(404).send({error: 'invalid user'});
            return next(new Error("invalid user"));
        }
        const { id: _id, username, password } = user;
        const data = { id: _id, username, password };
        res.status(200).send(data);
    })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
    req.logout();
    res.status(200);
};


export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("username", "Username must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("passwordConf", "Passwords do not match").equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(errors);
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            return res.status(409).send({error: "existing user"});
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.status(201).send(user);
            });
        });
    });
};


export const getProfile = (req: Request, res: Response) => {
    const user = req.user as UserDocument;
    User.findById({_id: user.id}).exec().then((_user) => {
        res.status(200).send(_user.profile);
    }).catch((err) => {
        res.status(404).send(err);
    })
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    User.findById(user.id, (err, user: UserDocument) => {
        if (err) { return next(err); }
        user.profile.firstName = req.body.name || "";
        user.profile.lastName = req.body.name || "";
        user.profile.gender = req.body.gender || "";
        user.profile.location = req.body.location || "";
        user.profile.website = req.body.website || "";
        user.save((err: WriteError) => {
            if (err) {
                if (err.code === 11000) {
                    return res.redirect("/account");
                }
                return next(err);
            }
            return res.status(201).send(user.profile)
        });
    });
};

export const deleteAccount = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    User.remove({ _id: user.id }, (err) => {
        if (err) { return next(err); }
        req.logout();
        res.redirect("/");
    });
};
