import { getUserByEmail, getUserByUsername, userModel } from '../models/User.mjs';
import Token from './token.mjs';

/**
 * Authenticate user based on username or email and password.
 * @param {string} username - The username or email.
 * @param {string} password - The user's password.
 * @param {function} done - The callback function.
 */
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
};

/**
 * Middleware to check for remember-me token and authenticate user if valid.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
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
            userModel.findById(userId, (err, user) => {
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
            });
        }
    });

    next();
};

/**
 * Middleware to consume remember-me token and clear the cookie on logout.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
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
};

/**
 * Middleware to check if the user is authenticated.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/login");
};

/**
 * Middleware to check if the user is already logged in.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/user/dashboard');
    next();
};

/**
 * Middleware to check if the user is an admin.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const isAdmin = (req, res, next) => {
    if (req.session.passport.user.isAdmin) return next();
    res.redirect('/'); // or 404
};

export { rememberMe, forgetMe, isAuthenticated, isLoggedIn, isAdmin };
