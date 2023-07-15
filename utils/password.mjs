import bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 */
function hash(password) {
    return bcrypt.hash(password, 10);
}

/**
 * Compares a password with a bcrypt hash.
 * @param {string} password - The password to compare.
 * @param {string} hash - The bcrypt hash to compare against.
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the password matches the hash.
 */
function compare(password, hash) {
    return bcrypt.compare(password, hash);
}

export default { hash, compare };
