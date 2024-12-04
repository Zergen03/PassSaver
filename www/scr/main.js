fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawData(data))

let drawData = (data) => {
  console.log(data);

  data.forEach(category => {
    let parent = document.getElementsByTagName('table')[0]
    let child = document.createElement('tr')
    child.innerText = category.name
    child.setAttribute('id', category.id)
    child.addEventListener('click', () => {
      removeSites()
      showSites(category.id)
    })
    parent.appendChild(child)
  })
}

function showSites(categoryId) {
  const addSiteButton = document. querySelector(".fa-square-plus")
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
      let trash = document.createElement('i')
      trash.classList.add('fas', 'fa-trash-alt')
      trash.setAttribute('onclick', `deleteSite(${site.id})`)
      let edit = document.createElement('i')
      edit.classList.add('fas', 'fa-edit')
      edit.setAttribute('onclick', `editSite(${site.id})`)

      child.setAttribute('id', `Site ${site.id}`)
      parent.appendChild(child)
      child.appendChild(text)
      child.appendChild(buttons)
      buttons.appendChild(trash)
      buttons.appendChild(edit)

    })
  }
  addSiteButton.id = categoryId
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
  if (categoryId == 0) {
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

function editSite(siteId) {
  console.log('edit sites: ' + siteId);
  
}
