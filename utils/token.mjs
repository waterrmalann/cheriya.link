import bcrypt from 'bcrypt';
import { tokenModel } from '../models/Token.mjs';

export default class Token {
    /**
     * Generates a secure token using bcrypt.
     * @param {function} callback - The callback function to handle the generated token.
     */
    static generate(callback) {
        // Generate a salt for bcrypt hashing
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return callback(err);

            // Hash the current timestamp using the generated salt
            bcrypt.hash(Date.now().toString(), salt, (err, hash) => {
                if (err) return callback(err);
                // Pass the generated token to the callback
                return callback(null, hash);
            });
        });
    }

    /**
     * Saves the token to the database.
     * @param {string} token - The token to be saved.
     * @param {string} userId - The associated user ID.
     * @param {function} callback - The callback function to handle the result.
     */
    static save(token, userId, callback) {
        // Create a new token document in the database
        tokenModel.create({ token, createdFor: userId }, (err) => {
            if (err) return callback(err);

            // Pass any potential error to the callback
            return callback(null);
        });
    }

    /**
     * Consumes and deletes the token from the database.
     * @param {string} token - The token to be consumed.
     * @param {function} callback - The callback function to handle the result.
     */
    static consume(token, callback) {
        // Find and delete the token document from the database
        tokenModel.findOneAndDelete({ token }, (err, tokenData) => {
            if (err) return callback(err);
            if (!tokenData) return callback(null, false);

            // Pass the associated user ID to the callback if the token is found
            return callback(null, tokenData.userId);
        });
    }

    /**
     * Validates the token against the database.
     * @param {string} token - The token to be validated.
     * @param {function} callback - The callback function to handle the result.
     */
    static validate(token, callback) {
        // Find and retrieve the token document from the database.
        tokenModel.findOne({ token }, (err, tokenData) => {
            if (err) return callback(err);
            if (!tokenData) return callback(null, false);

            // Pass the associated user ID to the callback if the token is found
            return callback(null, tokenData.userId);
        })
    }
}