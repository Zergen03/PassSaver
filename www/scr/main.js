fetch("http://localhost:3000/categories")
  .then(res => res.json())
  .then(data => drawData(data))

let drawData = (data) => {
  console.log(data);

  data.forEach(category => {
    let parent = document.getElementsByTagName('table')[0]
    let child = document.createElement('tr')
      let text = document.createElement('td')
      let buttons = document.createElement('td')

      child.classList.add('sites_row')
      text.innerText = category.name
      let trash = document.createElement('i')
      trash.classList.add('fas', 'fa-trash-alt')
      child.id = category.id

      text.addEventListener('click', () => {
        showSites(category.id)
      })
      buttons.addEventListener('click', () => {
        deleteCategory(category.id)
      })

      parent.appendChild(child)
      child.appendChild(text)
      child.appendChild(buttons)
      buttons.appendChild(trash)
  })
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