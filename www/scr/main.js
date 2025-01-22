fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawData(data))

let drawData = async (data) => {
  for (const category of data) {
    let parent = document.getElementsByTagName('table')[0]
    let child = document.createElement('tr')
    let text = document.createElement('td')
    let image = document.createElement('td')
    let buttons = document.createElement('td')

    child.classList.add('sites_row')
    text.innerText = category.name
    let exist = await checkImageExist(category.name);
    if (exist) {
      image.innerHTML = `<img src="../uploads/${category.name}.jpg" alt="Imagen de ${category.name}">`;
    } else {
      image.innerHTML = ` `;
    }
    image.classList.add('category_image')
    let trash = document.createElement('i')
    trash.classList.add('fas', 'fa-trash-alt')
    child.id = category.id

    child.addEventListener('click', () => {
      showSites(category.id)
      removeSites()
    })
    buttons.addEventListener('click', () => {
      deleteCategory(category.id)
    })

    parent.appendChild(child)
    child.appendChild(image)
    child.appendChild(text)
    child.appendChild(buttons)
    buttons.appendChild(trash)
  }
}

function deleteCategory(categoryId) {
  fetch(`http://localhost:3000/categories/${categoryId}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      return res.text();
    })
    .then(data => {
      console.log('Success:', data);
      let parent = document.getElementsByTagName('table')[0];
      let child = document.getElementById(categoryId);
      parent.removeChild(child);
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

function showSites(categoryId) {
  const addSiteButton = document.querySelector('[id^="addSiteButton "]');
  const errorMessage = document.getElementById(categoryId)
  document.querySelector('.error_message').style.display = 'none'
  fetch(`http://localhost:3000/sites/categories/${categoryId}`)
    .then(res => res.json())
    .then(data => drawSites(data))

  let drawSites = (data) => {
    data.forEach(site => {
      let parent = document.getElementsByTagName('table')[1]

      let child = document.createElement('tr')
      let text = document.createElement('td')
      let buttons = document.createElement('td')

      child.classList.add('sites_row')
      text.innerText = site.name
      text.classList.add('site_name')
      text.setAttribute('onclick', `showSiteInformation(true, ${site.id})`)
      let trash = document.createElement('i')
      trash.classList.add('fas', 'fa-trash-alt')
      trash.setAttribute('onclick', `deleteSite(${site.id})`)
      let edit = document.createElement('i')
      edit.classList.add('fas', 'fa-edit')
      edit.setAttribute('onclick', `showSiteInformation(true, ${site.id}), changeEdit(true)`)
      let link = document.createElement('i')
      link.classList.add('fas', 'fa-link')
      link.setAttribute('onclick', `window.open('${site.url}')`)

      child.setAttribute('id', `Site ${site.id}`)
      parent.appendChild(child)
      child.appendChild(text)
      child.appendChild(buttons)
      buttons.appendChild(link)
      buttons.appendChild(trash)
      buttons.appendChild(edit)

    })
  }
  addSiteButton.id = `addSiteButton ${categoryId}`
}

function removeSites() {
  let parent = document.getElementsByTagName('table')[1]
  let rows = parent.getElementsByTagName('tr')
  while (rows.length > 2) {
    parent.removeChild(rows[2])
  }
}

function saveCategoryId(categoryId) {
  const element = document.getElementById(categoryId)
  if (categoryId == "addSiteButton 0") {
    document.querySelector('.error_message').style.display = 'inline'
  } else {
    localStorage.setItem('categoryId', categoryId)
    window.location = './addSite.html'
  }
}


function deleteSite(siteId) {
  console.log('remove sites: ' + siteId);
  fetch(`http://localhost:3000/sites/${siteId}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      return res.text();
    })
    .then(data => {
      console.log('Success:', data);
      let site = document.getElementById(`Site ${siteId}`)
      site.remove()
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

function changeEdit(edit) {

  const title = document.getElementById('siteTitle')
  const url = document.getElementById('siteUrl')
  const username = document.getElementById('siteUser')
  const password = document.getElementById('password')
  const name = document.getElementById('siteName')
  const description = document.getElementById('siteDescription')
  const editButton = document.getElementById('siteModalEdit')

  if (edit) {
    title.removeAttribute('readonly');
    url.removeAttribute('readonly');
    username.removeAttribute('readonly');
    password.removeAttribute('readonly');
    name.removeAttribute('readonly');
    description.removeAttribute('readonly');
    editButton.style.color = '#ccc'
  } else {
    title.setAttribute('readonly', true);
    url.setAttribute('readonly', true);
    username.setAttribute('readonly', true);
    password.setAttribute('readonly', true);
    name.setAttribute('readonly', true);
    description.setAttribute('readonly', true);
    editButton.style.color = '#007bff'
  }
}

function showSiteInformation(display, siteId) {
  const checkbox = document.getElementById('siteShowPasswordCheckbox')
  localStorage.setItem('siteId', siteId)
  if (display) {
    checkbox.checked = false
    changePasswordVisibility(checkbox)
  }

  if (siteId) {
    fetch(`http://localhost:3000/sites/${siteId}`)
      .then(res => res.json())
      .then(site => {
        console.log(site);
        const title = document.getElementById('siteTitle')
        const url = document.getElementById('siteUrl')
        const username = document.getElementById('siteUser')
        const password = document.getElementById('password')
        const name = document.getElementById('siteName')
        const description = document.getElementById('siteDescription')

        name.value = site.name
        title.value = site.name
        url.value = site.url
        username.value = site.user
        password.value = site.password
        description.value = site.description
      })
  }
  const modal = document.getElementById('siteModal')
  if (display) {
    modal.style.display = 'flex'
  } else {
    modal.style.display = 'none'
  }
}

function editSite(event) {
  // event.preventDefault();
  const siteId = localStorage.getItem('siteId')
  const form = event.target
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch(`http://localhost:3000/sites/${siteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: data.siteName,
      url: data.siteUrl,
      user: data.siteUser,
      password: data.password,
      description: data.siteDescription
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      return res.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

async function checkImageExist(name) {
  return fetch(`http://localhost:3000/uploads/${name}.jpg`)
    .then(res => {
      if (res.ok) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => {
      console.warn('Error:', err);
      return false;
    });
}
