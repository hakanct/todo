// TODO: hover ozelligi ile bir checkbox uzerine gelince carpi ve kalem(edit)belirecek, updateTodo eklenmeli

function setCookie(cookieName, cookieValue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let cookie = ca[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

let addTodoTextbox = document.getElementById("todo-input");
let addTodoBtn = document.getElementById("add-todo-btn");
let approveTodoBtn = document.getElementById("approve-todo-btn");
let cancelTodoBtn = document.getElementById("cancel-todo-btn");

/* let todoList = {
  "Örnek Todo 1": false,
  "Örnek Todo 2": true,
  "Örnek Todo 3": false,
  "Örnek Todo 4": false,
  "Örnek Todo 5": false,
  "Örnek Todo 6": true
}; */
let todoList = JSON.parse(getCookie("todos") ? getCookie("todos") : "{}");
//console.log("Todo listesi (ham): " + JSON.stringify(todoList));
//console.log("Çerezden alınan todo listesi: " + todoListCookie);
console.log("Todo listesi cerez (ham): " + todoList);

function addToTodo(todoText) {
  todoList[todoText] = false;
  console.log("Yeni todo eklendi: " + todoText);
  console.log("Güncel todo listesi: ", todoList);
  //setCookie("todos", JSON.stringify(todoList), 30);
}

function add() {
  addTodoTextbox.classList.remove("deactivated");
  addTodoTextbox.classList.add("activated");
  addTodoBtn.classList.remove("activated");
  addTodoBtn.classList.add("deactivated");
  approveTodoBtn.classList.remove("deactivated");
  approveTodoBtn.classList.add("activated");
  cancelTodoBtn.classList.remove("deactivated");
  cancelTodoBtn.classList.add("activated");
  addTodoTextbox.focus();
}

function cancel() {
  addTodoTextbox.classList.remove("activated");
  addTodoTextbox.classList.add("deactivated");
  addTodoBtn.classList.remove("deactivated");
  addTodoBtn.classList.add("activated");
  approveTodoBtn.classList.remove("activated");
  approveTodoBtn.classList.add("deactivated");
  cancelTodoBtn.classList.remove("activated");
  cancelTodoBtn.classList.add("deactivated");
  addTodoTextbox.value = "";
}

// TODO: yeni ozellik ile yeni eklenen todolari todoListParsed e ekle ve cookie guncelle
function approve() {
  let todoText = addTodoTextbox.value.trim();
  if (todoText === "") {
    console.log("Yeni todo eklenemedi: Boş metin");
    return;
  }

  addToTodo(todoText);
  setCookie("todos", JSON.stringify(todoList), 30);
  cancel();
  listTodos();
}

function listTodos() {
  let existingTodo = Object.keys(todoList);
  let todoDiv = document.getElementById("todo-list");
  todoDiv.innerHTML = "";
  console.log("Listelemek icin Mevcut todo listesi: ", existingTodo);
  console.log("Listelemek icin Mevcut todo listesi (dizi): ", existingTodo);
  for (let i = 0; i < existingTodo.length; i++) {
    console.log("listelenen: " + existingTodo[i]);
    let todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    let label = document.createElement("span");
    label.textContent = existingTodo[i];
    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);
    todoDiv.appendChild(todoItem);

    checkbox.checked = todoList[existingTodo[i]];

    todoItem.addEventListener("click", function () {
      let isChecked = checkbox.checked;
      todoList[existingTodo[i]] = checkbox.checked;
      setCookie("todos", JSON.stringify(todoList), 30);
      console.log(
        "Todo durumu güncellendi: " +
          existingTodo[i] +
          " -> " +
          checkbox.checked
      );
    });
  }
}

addTodoBtn.addEventListener("click", add);
cancelTodoBtn.addEventListener("click", cancel);
approveTodoBtn.addEventListener("click", approve);

document.addEventListener("DOMContentLoaded", function () {
  listTodos();
});
