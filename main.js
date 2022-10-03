import './style.css'

function renderOnRefresh() {
  Object.keys(localStorage).sort().forEach(function(key){
    let todo = JSON.parse(window.localStorage.getItem(key))
    renderTodo(todo)
  })
}
renderOnRefresh()

let searchField = document.getElementById('search')

searchField.addEventListener('input', e => {
  Object.keys(localStorage).forEach(function(key){
    let item = JSON.parse(window.localStorage.getItem(key))
    let searchQuery = document.getElementById('search').value.toUpperCase()
    let liElementToHide = document.querySelector(`li[data-key="${item.id}"]`)
    if(!item.text.toUpperCase().includes(searchQuery)) {
      liElementToHide.style.display = "none"
    } else {
      liElementToHide.style.display = "flex"
    }
  })
})


//render, inject html
function renderTodo(todo) {
  let listContainer = document.querySelector('.todo-list')
  let listItem = document.createElement('li')
  listItem.setAttribute('class', `todo-list-item`)
  listItem.setAttribute('data-key', todo.id)
  listItem.innerHTML = `
  <span class="item-centered">${todo.text}</span>
  <div class="todo-list-item-btn-div">
  <button class="btn todo-list-item-edit-btn not-editing" name="edit" data-key="${todo.id}">Edit</button>
  <button class="btn todo-list-item-delete-btn" data-key="${todo.id}">Delete</button>
  </div>
  `

  listContainer.append(listItem)
}

//add object to the array
function addTodo(text) {
  let todo = {
    id: Date.now(),
    text
  }

  window.localStorage.setItem('item' + todo.id, JSON.stringify(todo))
  renderTodo(todo)
}

let form = document.querySelector('.todo-form')
form.addEventListener('submit', e => {
  e.preventDefault()
  let input = document.querySelector('.todo-form-input')
  let text = input.value.trim()
  if (text !== '') {
    addTodo(text)
    input.value = ''
    input.focus()
  }
})

let ulList = document.querySelector('.todo-list')
let editing = false

// Delete item
ulList.addEventListener('click', e => {
  e.preventDefault()
  if(e.target.nodeName !== "BUTTON"){
    return
  }
  let theBtn = e.target
  let itemID = e.target.dataset.key
  let objInStorage = JSON.parse(window.localStorage.getItem('item' + itemID))
  let editBtn = "not-editing"
  let deleteBtn = "todo-list-item-delete-btn"

  if(theBtn.classList.contains(deleteBtn)) {
  e.target.parentElement.parentElement.remove()
  window.localStorage.removeItem('item' + itemID)
  }

  
  // Edit function
  if(theBtn.classList.contains("not-editing") && editing == false) {
    theBtn.innerHTML = "Submit"
    let span = theBtn.parentElement.parentElement.firstElementChild
    let inputField = `<input class="item-centered" for="edit" type='text' id="edit-field" data-key="${objInStorage.id}" value="${objInStorage.text}"></input>`
    span.outerHTML = inputField
    let input = document.getElementById("edit-field")
    input.focus()
    input.select()
    setTimeout(() => {
      editing = true
      theBtn.classList.remove("not-editing")
      theBtn.classList.add("editing")
    }, 500);
    
  }

  if(theBtn.classList.contains("editing") && editing == true) {
    if(itemID == e.target.dataset.key) {
      let span = theBtn.parentElement.parentElement.firstElementChild
      let inputField = document.getElementById("edit-field")
      theBtn.innerHTML = "Edit"
      let objToEdit = JSON.parse(window.localStorage.getItem('item' + itemID))
      objToEdit.text = inputField.value
      window.localStorage.setItem('item' + itemID, JSON.stringify(objToEdit))
      let spanElement = `<span class="item-centered">${objToEdit.text}</span>`
      span.outerHTML = spanElement
      setTimeout(() => {
        editing = false
        theBtn.classList.add("not-editing")
        theBtn.classList.remove("editing")
      }, 500);
    }
    
    
    
  }
  
  
  
})

