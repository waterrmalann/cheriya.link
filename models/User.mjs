import { Schema, model } from "mongoose";
import pass from '../utils/password.mjs';

/**
 * User schema definition
 */
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    urls: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

/**
 * Compare the provided password with the user's stored password.
 * @param {string} password - The password to compare.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, or false otherwise.
 */
userSchema.methods.comparePassword = async function (password) {
    return await pass.compare(password, this.password);
}

/**
 * User model based on the user schema.
 */
const userModel = model("User", userSchema);

/**
 * Get a user by their email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user object, or null if not found.
 */
function getUserByEmail(email) {
    const user = userModel.findOne({ email: email });
    return user;
}

/**
 * Get a user by their username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user object, or null if not found.
 */
function getUserByUsername(username) {
    const user = userModel.findOne({ username: username });
    return user;
}

export { userModel, getUserByEmail, getUserByUsername };