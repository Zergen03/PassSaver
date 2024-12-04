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
      buttons.innerHTML = '<i class="fas fa-trash-alt"></i>'
      buttons.innerHTML += '<i class="fas fa-edit"></i>'

      child.setAttribute('id', `Site ${site.id}`)
      parent.appendChild(child)
      child.appendChild(text)
      child.appendChild(buttons)
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



