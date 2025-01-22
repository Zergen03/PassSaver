function createCategory(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const category = Object.fromEntries(formData.entries());

    for (let [key, value] of formData.entries()) {

        console.log(key, value);
    }


    // Verifica si el archivo ha sido seleccionado
    const fileInput = document.getElementById('categoryImage');
    if (fileInput.files.length > 0) {
    } else {
        console.error('No se ha seleccionado ningún archivo');
        return;
    }

    for (let [key, value] of formData.entries()) {
        
        console.log(`formData: ${key}:`, value);
    }

    fetch("http://localhost:3000/upload", {
        method: 'POST',
        body: formData
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error en la respuesta: ${res.status}`);
            }
            return res.json();
        })
        .then(data => console.log('Éxito:', data))
        .catch(err => console.error('Error:', err));

    fetch("http://localhost:3000/categories", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: category.name })
    })
        .then(res => res.json())
        .then(data => {

            let imageUrl = ''

            let parent = document.getElementsByTagName('table')[0]
            let child = document.createElement('tr')
            let image = document.createElement('td')
            let text = document.createElement('td')
            let buttons = document.createElement('td')

            fetch(`http://localhost:3000/uploads/${data.name}.jpg`)
                .then(res => { imageUrl = res.url })
                .catch(err => console.error('Error:', err))

            child.classList.add('sites_row')
            text.innerText = data.name
            image.innerHTML = data.image ? `<img src="${imageUrl}" alt="${data.name}">` : ''
            let trash = document.createElement('i')
            trash.classList.add('fas', 'fa-trash-alt')
            child.id = data.id

            child.addEventListener('click', () => {
                showSites(data.id)
                removeSites()
            })
            buttons.addEventListener('click', () => {
                deleteCategory(data.id)
            })

            parent.appendChild(child)
            child.appendChild(image)
            child.appendChild(text)
            child.appendChild(buttons)
            buttons.appendChild(trash)
            showCategoryModal(false)
        });

    const file = document.getElementById('categoryImage').files[0];
    if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Solo se permiten archivos de imagen (JPG, PNG, GIF).');
            this.value = '';
        }
    }
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
    document.getElementById('categoryName').value = ''
    const modal = document.getElementById('categoryModal')
    if (display) {
        modal.style.display = 'flex'
    } else {
        modal.style.display = 'none'
    }
}