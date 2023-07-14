const e_loginForm = document.getElementById('loginForm');
const e_registerForm = document.getElementById('registerForm');
const e_errorMessage = document.getElementById('errorMessage');
const e_successMessage = document.getElementById('successMessage');

e_loginForm && e_loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // form validation -
    if (e_loginForm.password.value.length < 1) return displayError("invalid password.");

    
    const formData =  new URLSearchParams(new FormData(e_loginForm));
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

    /*if (e_loginForm.remember.checked) {
        localStorage.setItem("rememberMe", 'true');
    }*/

    //e_loginForm.submit();
});

e_registerForm && e_registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (e_registerForm.password.value.length < 8) return displayError("password must be atleast 8 characters long.");
    if (e_registerForm.password2.value !== e_registerForm.password.value) return displayError("password mismatch");
    
    if (e_registerForm.username.value.length < 4) return displayError("username not long enough.");
    
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

function displayError(msg) {
    e_errorMessage.innerText = msg;
}

function displaySuccess(msg) {
    e_successMessage.innerText = msg;
}