import { urlModel as URL } from '../models/Url.mjs';

/**
 * Render the dashboard view.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function displayDashboard(req, res) {
    // Prepare data to be rendered in the dashboard view
    let renderData = {
        isAdmin: req.session.passport.user.isAdmin, // Indicate if the user is an admin
        hostname: req.hostname, // Get the hostname of the request
    };

    try {
        // Find URLs created by the current user and populate the renderData object
        const urls = await URL.find({ createdBy: req.session.passport.user.id });
        renderData.urls = urls.reverse(); // Reverse the order of URLs to display the most recent ones first
    } catch (err) {
        console.error(err);
    }

    res.render('user/dashboard', renderData); // Render the dashboard view with the provided data
}

export default {
    displayDashboard,
};
