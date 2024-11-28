fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawData(data))

let drawData = (data) => {
  console.log(data);

  data.forEach(category => {
    let parent = document.getElementsByTagName('table')[0]
    let child = document.createElement('tr')
    child.innerText = category.name
    child.addEventListener('click', () => {
      showSites(category.id)
    })
    parent.appendChild(child)
  })
}