const e_registerForm = document.getElementById('registerForm');
const e_errorMessage = document.getElementById('errorMessage');

/**
 * Displays an error message in the general error message element.
 * @param {string} msg - The error message to display.
 */
function displayError(msg) {
    e_errorMessage.innerText = msg;
}

/**
 * Creates an error display function that updates the specified element with an error message.
 *
 * @param {HTMLElement} element - The element to update with the error message.
 * @returns {Function} The error display function.
 */
function errorDisplayFunc(element) {
    /**
     * Displays the error message in the element.
     *
     * @param {string} msg - The error message to display.
     */
    return function displayError(msg) {
        let write = '';
        if (msg.length > 0) {
            write = '(' + msg + ')';
        }
        element.innerText = write;
    };
}

// Create specialized error display functions for specific elements
const displayPasswordError = errorDisplayFunc(document.getElementById('passwordError'));
const displayUsernameError = errorDisplayFunc(document.getElementById('usernameError'));
const displayEmailError = errorDisplayFunc(document.getElementById('emailError'));

var validity = {
    username: false,
    password: false,
    email: false
};

// Input event listener for username field
e_registerForm.username.addEventListener('input', (e) => {
    if (e.target.value.length < 3) {
        validity.username = false;
        return displayUsernameError("username must be at least 3 characters long.");
    }
    displayUsernameError('');
    validity.username = true;
});

// Input event listener for password field
e_registerForm.password.addEventListener('input', (e) => {
    if (e.target.value.length < 8) {
        validity.password = false;
        return displayPasswordError("password must be at least 8 characters long.");
    }
    displayPasswordError('');
    validity.password = true;
});

// Change event listener for email field
e_registerForm.email.addEventListener('change', (e) => {
    if (!e.target.checkValidity()) {
        validity.email = false;
        return displayEmailError(e.target.validationMessage);
    }
    displayEmailError('');
    validity.email = true;
});

// Form submit event listener
e_registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validity.username || !validity.password || !validity.email) {
        return displayError("there are still errors left to resolve.");
    }

    const formData = new URLSearchParams(new FormData(e_registerForm));
    fetch('/auth/register', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.location;
            } else {
                displayError(data.message);
            }
        })
        .catch(error => {
            displayError(error);
            console.error(error);
        });
});

// Click event listener for toggle password visibility button
e_registerForm.togglePassword.addEventListener('click', () => {
    const type = e_registerForm.password.getAttribute("type") === "password" ? "text" : "password";
    e_registerForm.password.setAttribute("type", type);
});