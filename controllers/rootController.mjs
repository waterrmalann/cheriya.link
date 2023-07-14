/**
 * Render the home page.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function displayHome(req, res) {
    res.render('index');
}

export default {
    displayHome,
};
