/**
 * Validates a username.
 * @param {string} username - The username to validate.
 * @returns {boolean} - True if the username is valid, false otherwise.
 */
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    return usernameRegex.test(username);
}

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function validateURL(url) {
    const urlRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
}

export { validateUsername, validateEmail, validateURL };