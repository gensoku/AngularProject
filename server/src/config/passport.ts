import passport from "passport";
//import passportLocal from "passport-local";
import { BasicStrategy } from "passport-http";
import { User, UserDocument } from "../models/User";
import { Request, Response, NextFunction } from "express";

//const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


export const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("basic",{session: false}, (err: Error, user: UserDocument) => {
            if (err) { return next(err); }
            if (!user) {
                res.status(404).send({error: 'invalid user'});
                return next(new Error("invalid user"));
            }
            next();
        })(req, res, next);
    };
};

passport.use(new BasicStrategy(
    function(username: string, password: string, cb: any) {
        User.findOne({username}).exec().then((user) => {
            if (!user) { return cb(null, false); }
            user.comparePassword(password, (err, _match) => {
                if (err) { return cb(err) ;}
                if (!_match) { return cb(new Error("passwords does not match"));}
                return cb(null, user);
            })
        }).catch((err) => {
            return cb(err);
        })
    }));

/**
 * Sign in using Email and Password. unused because of basic auth
 */
// passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//     User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
//         if (err) { return done(err); }
//         if (!user) {
//             return done(undefined, false, { message: `Email ${email} not found.` });
//         }
//         user.comparePassword(password, (err: Error, isMatch: boolean) => {
//             if (err) { return done(err); }
//             if (isMatch) {
//                 return done(undefined, user);
//             }
//             return done(undefined, false, { message: "Invalid email or password." });
//         });
//     });
// }));

/**
 * Login Required middleware.
 * used with session
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401);
};
