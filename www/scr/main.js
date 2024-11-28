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
  fetch(`http://localhost:3000/sites/categories/${categoryId}`)
    .then(res => res.json())
    .then(data => drawSites(data))

  let drawSites = (data) => {
    data.forEach(site => {
      let parent = document.getElementsByTagName('table')[1]

      let child = document.createElement('tr')
      child.innerText = site.name
      child.setAttribute('id', site.id)
      child.addEventListener('click', () => {
        showSite(site.id)
      })
      parent.appendChild(child)
    })
  }
}

function removeSites() {
  let parent = document.getElementsByTagName('table')[1]
  let rows = parent.getElementsByTagName('tr')  
  while (rows.length > 1) {
    parent.removeChild(parent.removeChild(rows[1]))
  }
}