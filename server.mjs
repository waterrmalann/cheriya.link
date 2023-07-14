//////////////////////////
import { config } from 'dotenv';
config();

import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import authUser from './utils/authenticate.mjs';

import authRouter from './routes/auth.mjs';
import userRouter from './routes/user.mjs';
import adminRouter from './routes/admin.mjs';
import rootRouter from './routes/root.mjs';
import urlRouter from './routes/url.mjs';
import { redirectURL } from './controllers/urlController.mjs';
/* Let the fun begin... */
//////////////////////////

// Initialize express app.
const app = express();

// Establish conenction with MongoDB.
mongoose.connect("mongodb://localhost/cheriya", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// Set EJS as the templating language and view engine.
app.set('view engine', 'ejs');
// Properly parse request body and JSON.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files in /public directory.
app.use(express.static('public'));

// Set up express-session to hold user sessions.
app.use(session({
    secret: nanoid(),
    resave: false,
    saveUninitialized: true,
}));

app.use(cookieParser());

// Initialize passport.js
app.use(passport.initialize());
// Hook it to express-session
app.use(passport.session());

// Set up Passport-Local which provides username + password authentication.
passport.use(new LocalStrategy(authUser));

// Provide method for serializing passport authentication into session store.
passport.serializeUser((user, done) => {
    const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
    }
    done(null, userData);
});

// Provide method for deserializing/deleting authenticated user from session store.
passport.deserializeUser((user, done) => {
    done(null, user);
});

/* Set up the necessary routes */

// Authentication Routes: register, login, logout
app.use('/auth', authRouter);
// Admin Routes: dashboard
app.use('/admin', adminRouter);
// User Routes: dashboard
app.use('/user', userRouter);
// URL Routes: shorten, delete, :shortCode
app.use('/url', urlRouter);
// Root Routes: index
app.use('/', rootRouter);

// Handle a short URL.
app.get('/:shortCode', redirectURL);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`⚡ [server] Listening on https://localhost:${PORT}`);
});