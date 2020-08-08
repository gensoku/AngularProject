import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import { AuthToken } from '../types/interfaces';

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    username: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    facebook: string;
    tokens: AuthToken[];

    profile: {
        firstName: string;
        lastName: string;
        gender: string;
        location: string;
        website: string;
        picture: string;
    };
    comments: mongoose.Schema.Types.ObjectId[];

    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    username: {
        type: String,
        unique: true
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    profile: {
        firstName: String,
        lastName: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    },
    comments: Array
}, { timestamps: true });


userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema, "users");
