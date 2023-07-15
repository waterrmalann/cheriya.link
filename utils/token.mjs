import bcrypt from 'bcrypt';
import { tokenModel } from '../models/Token.mjs';

export default class Token {
    /**
     * Generates a secure token using bcrypt.
     * @returns {Promise<string>} A promise that resolves with the generated token.
     */
    static async generate() {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(Date.now().toString(), salt);
            return hash;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Saves the token to the database.
     * @param {string} token - The token to be saved.
     * @param {string} userId - The associated user ID.
     * @returns {Promise<void>} A promise that resolves when the token is saved.
     */
    static async save(token, userId) {
        try {
            await tokenModel.create({ token, createdFor: userId });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Consumes and deletes the token from the database.
     * @param {string} token - The token to be consumed.
     * @returns {Promise<string|boolean>} A promise that resolves with the associated user ID if the token is consumed successfully, or false if the token is not found.
     */
    static async consume(token) {
        try {
            const tokenData = await tokenModel.findOneAndDelete({ token });
            return tokenData ? tokenData.userId : false;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Validates the token against the database.
     * @param {string} token - The token to be validated.
     * @returns {Promise<string|boolean>} A promise that resolves with the associated user ID if the token is valid, or false if the token is not found.
     */
    static async validate(token) {
        try {
            const tokenData = await tokenModel.findOne({ token });
            return tokenData ? tokenData.createdFor : false;
        } catch (err) {
            throw err;
        }
    }
}
