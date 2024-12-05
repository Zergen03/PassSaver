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