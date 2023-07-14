import { userModel as User } from '../models/User.mjs';
import { urlModel as sURL } from '../models/Url.mjs';
import { validateURL } from '../utils/validate.mjs';
import { nanoid } from 'nanoid';

/**
 * Handle URL shortening.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response indicating success or failure
 */
async function handleURLShortening(req, res) {
    const owner = await User.findById(req.session.passport.user.id);
    const url = req.body.url;

    // Validate the URL format
    if (!validateURL(url)) {
        res.json({ success: false, message: 'Invalid URL' });
        return;
    }

    const shortCode = nanoid(11);
    // Create a new URL document in the database
    sURL.create({ url, shortCode, clicks: 0, createdBy: owner._id });
    // Add the shortCode to the owner's URLs array
    owner.urls.push(shortCode);
    await owner.save();
    res.json({ success: true, location: `${req.hostname}/${shortCode}`, shortCode: shortCode });
}

/**
 * Handle URL deletion.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response indicating success or failure
 */
async function handleURLDeletion(req, res) {
    const shortCode = req.params.shortCode;

    try {
        // Find the document associated with the user and the given shortCode
        const doc = await User.findOne({ _id: req.session.passport.user.id, urls: shortCode });
        if (!doc) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Delete the URL document
        await sURL.findOneAndDelete({ shortCode });
        // Remove the shortCode from the user's URLs array
        await User.updateOne({ _id: req.session.passport.user.id }, { $pull: { urls: shortCode } });
        res.status(200).json({ success: true, message: 'URL was deleted successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * Display the URL preview page.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Rendered preview page or redirect to the homepage
 */
async function displayURLPreview(req, res) {
    const shortCode = req.params.shortCode;

    try {
        // Find the URL document associated with the shortCode
        const doc = await sURL.findOne({ shortCode: shortCode });
        if (!doc) {
            return res.redirect('/');
        }

        return res.render('preview', { title: 'Preview URL', shortURL: `/${doc.shortCode}`, longURL: doc.url });
    } catch (err) {
        res.redirect('/');
    }
}

/**
 * Redirect to the original URL.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Redirect to the original URL or the homepage
 */
export async function redirectURL(req, res) {
    const shortCode = req.params.shortCode;

    try {
        // Find the URL document associated with the shortCode
        const doc = await sURL.findOne({ shortCode: shortCode });

        if (!doc) {
            return res.redirect('/');
        }

        // Increment the click count and save the document
        doc.clicks++;
        await doc.save();
        return res.redirect(doc.url);
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
}

export default { handleURLShortening, handleURLDeletion, displayURLPreview, redirectURL };