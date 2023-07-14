const e_shortenForm = document.getElementById('shortenForm');
const e_errorMessage = document.getElementById('errorMessage');
const e_outputMessage = document.getElementById('outputMessage');
const e_shortLink = e_outputMessage.getElementsByClassName('short-link')[0];

e_shortenForm && e_shortenForm.addEventListener('submit', (e) => {
    e.preventDefault();

    displayOutput('');
    displayError('');
    
    const formData = new URLSearchParams(new FormData(e_shortenForm));
    fetch('/url/shorten', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(res => {
        if (res.success) {
            displayOutput(res.location);
        } else {
            displayError(res.message);
        }
    })

});

function displayError(msg) {
    e_errorMessage.innerText = msg;
}

function displayOutput(url) {
    if (url.length < 1) return e_outputMessage.style.display = 'none';
    e_outputMessage.style.display = 'block';
    e_shortLink.innerText = url;
    e_shortLink.href = "https://" + url;
}

document.getElementById('urlCardsContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-trash')) {
        const shortCode = e.target.dataset.id;
        fetch(`/url/${shortCode}`, {
            method: "DELETE"
        }).then(response => response.json())
        .then(res => {
            console.log(`[delete] ${res.toString()}`);
            if (res.success) {
                alert("Deleted URL.");
                e.target.parentElement?.parentElement.remove();
            } else {
                alert("Unable to remove URL.");
            }
        })
        .catch(err => {
            console.error(err);
        })
    }
});

displayOutput('');
displayError('');