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
//let todoList = JSON.parse(getCookie("todos") ? getCookie("todos") : "{}");
let todoList;
try {
  const parsed = JSON.parse(getCookie("todos") || "{}");
  todoList = typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
} catch {
  todoList = {};
}
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

function deleteTodo(todoText) {
  if (!(todoText in todoList)) {
    console.log("Todo bulunamadı:", todoText);
    return;
  }

  delete todoList[todoText];
  setCookie("todos", JSON.stringify(todoList), 30);
  console.log("Silinen todo:", todoText);
}

function editTodo(todoIndex, todoText) {
  let todoInnerHTML = document.querySelector(`div.todo-item[data-todo-index='${todoIndex}']`);
  let currentTodoText = todoText;

  todoInnerHTML.innerHTML = "";

  let editTextbox = document.createElement("input");
  editTextbox.type = "text";
  editTextbox.value = currentTodoText;
  editTextbox.classList.add("edit-todo-textbox");

  let cancelEditBtn = document.createElement("button");
  cancelEditBtn.textContent = "Cancel";
  cancelEditBtn.classList.add("cancel-edit-btn");
  cancelEditBtn.addEventListener("click", function () {
    listTodos();
  });

  let approveEditBtn = document.createElement("button");
  approveEditBtn.textContent = "Approve";
  approveEditBtn.classList.add("approve-edit-btn");
  approveEditBtn.addEventListener("click", function () {
    let newTodoText = editTextbox.value.trim();
    if (newTodoText === "") {
      console.log("Güncelleme başarısız: Boş metin");
      return;
    }
    updateTodo(currentTodoText, newTodoText);
    listTodos();
  });

  todoInnerHTML.appendChild(editTextbox);
  todoInnerHTML.appendChild(cancelEditBtn);
  todoInnerHTML.appendChild(approveEditBtn);
}

function updateTodo(oldText, newText) {
  if (!(oldText in todoList)) return;
  if (newText in todoList && newText !== oldText) return;

  const newObj = {};

  Object.keys(todoList).forEach(key => {
    if (key === oldText) {
      newObj[newText] = todoList[key];
    } else {
      newObj[key] = todoList[key];
    }
  });

  todoList = newObj;
  setCookie("todos", JSON.stringify(todoList), 30);
}

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

function lineThroughLabel(labelElement, isChecked) {
  if (isChecked) {
    labelElement.classList.add("checeked-label");
  } else {
    labelElement.classList.remove("checeked-label");
  }
}

function listTodos() {
  console.clear();
  let existingTodo = Object.keys(todoList);
  let todoDiv = document.getElementById("todo-list");
  todoDiv.innerHTML = "";
  console.log("Listelemek icin Mevcut todo listesi: ", existingTodo);
  for (let i = 0; i < existingTodo.length; i++) {
    console.log("listelenen: " + existingTodo[i]);
    let todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    todoItem.dataset.todoIndex = i;

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todoList[existingTodo[i]];

    let label = document.createElement("span");
    label.textContent = existingTodo[i];

    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons-div");

    let edit = document.createElement("span");
    edit.innerHTML = "&#128393;";
    edit.classList.add("edit");
    edit.dataset.todoText = existingTodo[i];
    edit.addEventListener("click", function (event) {
      event.stopPropagation(); // prevent parent click
      let todoIndex = i;
      let todoText = event.target.dataset.todoText;
      editTodo(todoIndex, todoText);
      //listTodos();
      //console.log("Güncel todo listesi: ", todoList);
    });

    let trash = document.createElement("span");
    trash.innerHTML = "&#128465;";
    trash.classList.add("trash");
    trash.dataset.todoText = existingTodo[i];
    trash.addEventListener("click", function (event) {
      event.stopPropagation(); // prevent parent click
      let todoText = event.target.dataset.todoText;
      deleteTodo(todoText);
      listTodos();
      console.log("Güncel todo listesi: ", todoList);
    });

    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);
    todoItem.appendChild(buttonsDiv);
    buttonsDiv.appendChild(edit);
    buttonsDiv.appendChild(trash);
    todoDiv.appendChild(todoItem);

    lineThroughLabel(label, checkbox.checked);

    checkbox.addEventListener("click", function () {
      todoList[existingTodo[i]] = checkbox.checked;
      setCookie("todos", JSON.stringify(todoList), 30);
      console.log(
        "Todo durumu güncellendi: " +
          existingTodo[i] +
          " -> " +
          checkbox.checked
      );
      lineThroughLabel(label, checkbox.checked);
    });
  }
}

addTodoBtn.addEventListener("click", add);
cancelTodoBtn.addEventListener("click", cancel);
approveTodoBtn.addEventListener("click", approve);

document.addEventListener("DOMContentLoaded", function () {
  listTodos();
});
