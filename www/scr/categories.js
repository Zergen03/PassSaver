function createCategory(event) {
    event.preventDefault()
    const form = event.target;
    const formData = new FormData(form);
    const site = Object.fromEntries(formData.entries());

    fetch("http://localhost:3000/categories", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(site)
    })
        .then(res => res.json())
        .then(data => {
            let parent = document.getElementsByTagName('table')[0]
            let child = document.createElement('tr')
            let text = document.createElement('td')
            let buttons = document.createElement('td')

            child.classList.add('sites_row')
            text.innerText = data.name
            let trash = document.createElement('i')
            trash.classList.add('fas', 'fa-trash-alt')
            child.id = data.id

            text.addEventListener('click', () => {
                showSites(data.id)
            })
            buttons.addEventListener('click', () => {
                deleteCategory(data.id)
            })

            parent.appendChild(child)
            child.appendChild(text)
            child.appendChild(buttons)
            buttons.appendChild(trash)
            showCategoryModal(false)
        });
}

document.getElementById("categoryName").addEventListener("blur", async function () {
    const nameField = this;
    const name = this.value
    console.log('name:', name);

    fetch(`http://localhost:3000/categories`)
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
                    nameField.setCustomValidity('Category name already exists');
                }
                else {
                    nameField.setCustomValidity('');
                }

            } else {
                nameField.setCustomValidity('Category name is required');
            }
        });
})
document.getElementById('categoryName').addEventListener('input', function () {
    this.setCustomValidity('');
});

function showCategoryModal(display) {
    const modal = document.getElementById('categoryModal')
    if (display) {
        modal.style.display = 'flex'
    } else {
        modal.style.display = 'none'
    }
}