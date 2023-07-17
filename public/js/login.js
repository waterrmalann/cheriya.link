const e_loginForm = document.getElementById('loginForm');
const e_errorMessage = document.getElementById('errorMessage');

/**
 * Displays an error message in the general error message element.
 * @param {string} msg - The error message to display.
 */
function displayError(msg) {
    e_errorMessage.innerText = msg;
}

// Form submit event listener
e_loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new URLSearchParams(new FormData(e_loginForm));
    fetch('/auth/login', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                localStorage.setItem('currentUser', e_loginForm.username.value);
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