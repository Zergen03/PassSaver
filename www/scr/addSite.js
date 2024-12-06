function createSite(event) {
    console.log('createSite');

    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const site = Object.fromEntries(formData.entries());

    const categoryId = localStorage.getItem('categoryId');
    const match = categoryId.match(/\d+$/);
    site.category_id = match ? match[0] : null;
    console.log('Site data:', site);

    fetch(`http://localhost:3000/categories/${site.category_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(site)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            return res.json();
        })
        .then(data => {
            console.log('Success:', data);
            window.location = './index.html';
        })
        .catch(err => {
            console.error('Error:', err);
        });
}

document.getElementById("name").addEventListener("blur", async function () {
    const nameField = this;
    const name = this.value
    console.log('name:', name);

    fetch(`http://localhost:3000/sites/categories/${localStorage.getItem('categoryId')}`)
        .then(res => res.json())
        .then(data => {
            let exist = false;
            data.forEach(site => {
                if (site.name === name) {
                    exist = true;
                }
            });
            if (name) {
                if (exist) {
                    nameField.setCustomValidity('Site name already exists');
                }
                else {
                    nameField.setCustomValidity('');
                }

            } else {
                nameField.setCustomValidity('Site name is required');
            }
        });
})

function showPasswordModal(display) {
    const modal = document.getElementById('passwordModal')
    if (display) {
        modal.style.display = 'flex'
    } else {
        modal.style.display = 'none'
    }
}

function generatePassword(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    const numberChars = '0123456789';

    let availableChars = '';
    if (data.lowercase) availableChars += lowercaseChars;
    if (data.capitalLetters) availableChars += uppercaseChars;
    if (data.symbols) availableChars += symbolChars;
    if (data.numbers) availableChars += numberChars;

    if (availableChars === '') {
        alert('Please select at least one character type!');
        return '';
    }

    let password = '';
    for (let i = 0; i < data.rangeValue; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }

    document.getElementById('password').value = password;
    showPasswordModal(false);

}

function changePasswordVisibility(checked) {
    const password = document.getElementById('password');
    checked ? password.type = 'text' : password.type = 'password';
}

function prueba(){
    console.log('prueba');
}
