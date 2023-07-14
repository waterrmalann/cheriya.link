import { userModel as User, getUserByEmail, getUserByUsername } from '../models/User.mjs';
import { validateUsername, validateEmail } from '../utils/validate.mjs';
import pass from '../utils/password.mjs';
import passport from 'passport'
import Token from '../utils/token.mjs';

/**
 * Render the login view.
 * GET /auth/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function displayLogin(req, res) {
    res.render('login', { title: 'Login' });
}

/**
 * Render the registration view.
 * GET /auth/register
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function displayRegistration(req, res) {
    res.render('register', { title: 'Create an account' });
}

/**
 * Handle user registration.
 * POST /auth/register
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleRegistration(req, res) {
    try {
        const usernameValidation = validateUsername(req.body.username);
        const emailValidation = validateEmail(req.body.email);

        if (await getUserByEmail(req.body.email) || await getUserByUsername(req.body.username)) {
            // Username or email already taken
            res.send({ success: false, message: 'Email/username not available' });
        } else if (!usernameValidation) {
            // If the username failed validation
            res.send({ success: false, message: 'Invalid username' });
        } else if (!emailValidation) {
            // If the email failed validation
            res.send({ success: false, message: 'Invalid email' });
        } else {
            // Hash the password for better security
            const hashedPassword = pass.hash(req.body.password);
            console.log(`✨ [registration] User registered with as '${req.body.username}' with email '${req.body.email}'`);
            User.create({ username: req.body.username, email: req.body.email, password: hashedPassword });
            res.send({ success: true, location: '/auth/login?registered=true' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.send({ success: false, message: 'An error occurred during sign-up.' });
    }
}

/**
 * Handle user login.
 * POST /auth/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function handleLogin(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username/password' });
        }
        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Session establishment failed' });

            if (req.body.remember) {
                const token = Token.generate();
                Token.save(token, user.id, (err) => {
                    if (err) return res.status(500).json({ success: false, message: "Token generation failed" });

                    res.cookie('rememberMe', token, { path: '/', httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // Set remember-me token in a cookie (7 days expiration)
                    console.log(`💫 [login] '${req.body.username}' has logged in with remember me.`);
                    return res.json({ success: true, location: '/user/dashboard?remembered=true' });
                });
            } else {
                console.log(`💫 [login] '${req.body.username}' has logged in.`);
                return res.json({ success: true, location: '/user/dashboard' });
            }
        });
    })(req, res, next);
}

/**
 * Handle user logout.
 * DELETE /auth/logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function handleLogout(req, res, next) {
    //console.log(`👋 [logout] User '${req.user?.username}' has logged out.`);
    req.logout(function (err) {
        if (err) { return next(err); }
    });
    res.redirect('/auth/login');
}

export default {
    handleLogin,
    handleRegistration,
    handleLogout,
    displayLogin,
    displayRegistration,
};


/*
import { fetch } from 'node-fetch';
async function isURLSafe(url, apiKey) {
  const body = {
    client: {
      clientId: 'yourcompanyname',
      clientVersion: '1.5.2'
    },
    threatInfo: {
      threatTypes: [
        'THREAT_TYPE_UNSPECIFIED',
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION'
      ],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }]
    }
  };
  const response = await fetch(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }
  );
  const data = await response.json();
  return data.matches ? false : true;
}*/