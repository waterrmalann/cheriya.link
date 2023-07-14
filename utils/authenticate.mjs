import { getUserByEmail, getUserByUsername, userModel } from '../models/User.mjs';
import Token from './token.mjs';

export default async (username, password, done) => {

    try {
        // Support logging in using either email or username.
        let user = username.includes('@') ? await getUserByEmail(username) : await getUserByUsername(username);

        if (!user) {
            return done(null, false);
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}

const rememberMe = (req, res, next) => {
    // If the user is already authenticated or does not have a rememberMe cookie, short-circuit.
    if (req.isAuthenticated || !res.cookies.rememberMe) return next();

    const token = res.cookies.rememberMe;
    Token.validate(token, (err, userId) => {
        if (err) {
            console.error(err);
            return next();
        }
        if (userId) {
            const user = userModel.findById(userId, (err, user) => {
                if (err) {
                    console.error(err);
                    return next();
                }
                if (user) {
                    req.logIn(user, (err) => {
                        if (err) return res.sendStatus(500);
                        console.log(`💫 [login] '${user.username}' has been remembered.`);
                    });
                }
            })
        }
    });

    next();
}

const forgetMe = (req, res, next) => {
    if (req.user && req.cookies.rememberMe) {
        Token.consume(req.cookies.rememberMe, (err) => {
            if (err) {
                console.error(err);
            }
            res.clearCookie('rememberMe', { path: '/' });
            return next();
        });
    } else {
        return next();
    }
}

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/login");
}

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/user/dashboard');
    next();
}

const isAdmin = (req, res, next) => {
    if (req.session.passport.user.isAdmin) return next();
    res.redirect('/'); // or 404
}

export { rememberMe, forgetMe, isAuthenticated, isLoggedIn, isAdmin };