function openPopup(action) {
    document.getElementById('popup-form').action = '/' + action.toLowerCase();
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

document.getElementById('popup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    console.log('Form submitted:', name, email);
});
