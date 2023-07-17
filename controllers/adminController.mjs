import { userModel as User } from '../models/User.mjs';

/**
 * Render the dashboard view.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function displayDashboard(req, res) {
    res.render('admin/dashboard');
}

/**
 * Fetch information about users.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response containing user data
 */
async function fetchUserdata(req, res) {
    const skip = req.query.skip || 0;
    try {
        // Fetch users from the database, excluding unnecessary fields
        const users = await User.find({}, { username: true, email: true, isAdmin: true, createdAt: true }).skip(skip).limit(10);
        return res.json({ users });
    } catch (err) {
        console.error('⚠️ [error] Controllers/Admin (User Fetch):', err);
        return res.json({ users: [] });
    }
}

/**
 * Handle user removal.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response indicating success or failure
 */
async function handleUserRemoval(req, res) {
    const userId = req.params.userId;
    try {
        // Delete the user with the specified ID from the database
        await User.deleteOne({ _id: userId });
        res.status(200).json({ success: true, message: 'User was removed successfully' });
    } catch (err) {
        console.error('⚠️ [error] Controllers/Admin (User Removal):', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * Handle user editing.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response indicating success or failure
 */
async function handleUserEdit(req, res) {
    const userId = req.params.userId;
    const data = req.body;
    try {
        // Find the user by ID and update the specified fields
        await User.findByIdAndUpdate(userId, data);
        res.status(200).json({ success: true, message: 'User was edited successfully' });
    } catch (err) {
        console.error('⚠️ [error] Controllers/Admin (User Edit):', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export default {
    displayDashboard,
    fetchUserdata,
    handleUserRemoval,
    handleUserEdit,
};
