const toDoListNode = document.querySelector(".toDo__list");
const toDoFormNode = document.querySelector(".toDo__form");
const toDoInputNode = document.querySelector(".toDo__input");
const deleteAllNode = document.querySelector(".footer__delete-all");
const deleteButtonsNode = document.querySelector(".footer");
const deleteCompletedNode = document.querySelector(".footer__delete-check");
const LS_TODO_KEY = "toDo";
//пустой массив для добавления задач

let taskArr = JSON.parse(localStorage.getItem(LS_TODO_KEY)) ?? [];

// шаблон отрисовки
function getTasksBegin(toDo) {
  const toDoItem = document.createElement("li");
  toDoItem.className = "toDo__item";
  toDoItem.innerHTML = `
  <input class = 'toDo__item-check' type="checkbox">
  <p class="toDo__item-text">${toDo.task}</p>
  <form class = "toDo__form-edit"><input value = "${toDo.task}" class="toDo__input-text toDo__input-text-none"/>
  <button class = "toDo__button-edit">✏️</button>
  <button class = "toDo__check-edit toDo__check-edit-done">✅</button>
    </form>
  <button class = "toDo__button-delete"><img class ="toDo__button-delete" src="./🗑.png" alt=""></button>
    `; // ${toDo.done ? "checked" : null} // ${toDo.done && "checked"} - относится к чекбоксу
  // <input class="toDo__input-text" type="text" value = ${toDo.task} disabled> - изначальный инпут прописывал так

  const textEraseNode = toDoItem.querySelector(".toDo__item-check");
  textEraseNode.checked = toDo.done;
  textEraseNode.addEventListener("change", () => changeCheck(toDo.id));

  const deleteTaskNode = toDoItem.querySelector(".toDo__button-delete");
  deleteTaskNode.addEventListener("click", () => deleteCrossButton(toDo.id));

  const buttonEdit = toDoItem.querySelector(".toDo__button-edit");
  const buttonEditDone = toDoItem.querySelector(".toDo__check-edit");

  const shoppingListItem = toDoItem.querySelector(".toDo__input-text");
  const shoppingListItemText = toDoItem.querySelector(".toDo__item-text");
  const editForm = toDoItem.querySelector(".toDo__form-edit");

  editForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    shoppingListItem.classList.toggle("toDo__input-text-none");
    shoppingListItemText.classList.toggle("toDo__item-text-none");
    buttonEdit.classList.toggle("toDo__button-edit-done");
    buttonEditDone.classList.toggle("toDo__check-edit-done");
    shoppingListItemText.innerText = shoppingListItem.value;

    replaceTaskText(toDo.id);
  });
  // функция по замене текста в таске
  function replaceTaskText(id) {
    let findText = taskArr.find((element) => element.id === id);
    if (shoppingListItem.value.length == 0) {
      findText.task = findText.task;
      renderTasks(taskArr);
    } else {
      findText.task = shoppingListItem.value;
    }
    storage(taskArr);
  }

  return toDoItem;
}
// // функция сохранения в localStorage
function storage(taskArr) {
  localStorage.setItem(LS_TODO_KEY, JSON.stringify(taskArr));
}

// функция - проверка на тру.фолс при чекбоксе
function changeCheck(id) {
  let findChecked = taskArr.find((el) => el.id === id);
  findChecked.done = !findChecked.done;
  renderTasks(taskArr);
}

// функция - удаление тасок по крестикам
function deleteCrossButton(id) {
  taskArr = taskArr.filter((el) => el.id !== id);
  renderTasks(taskArr);
}
// функция - удаление тасок по кнопке "удалить завершенные"
function deleteSelectedButton() {
  taskArr = taskArr.filter((el) => !el.done);
  renderTasks(taskArr);
}

//рендер задач
function renderTasks(arr) {
  toDoListNode.innerHTML = "";
  arr.forEach((element) => {
    const tasks = getTasksBegin(element);
    toDoListNode.append(tasks);
  });
  storage(arr);
  removeButtons();
}

// функция добавления задач в массив
function getTasks(text) {
  taskArr.push({
    task: text.trim(),
    id: Date.now(),
    done: false,
  });
  renderTasks(taskArr);
  toDoListNode.classList.remove("toDo__list-none");
  deleteButtonsNode.classList.remove("footer__show");
}

// слушатель событий для сабмита
toDoFormNode.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (toDoInputNode.value.trim() != "") {
    getTasks(toDoInputNode.value);
  }
  toDoInputNode.value = "";
});

//удаление выполненных тасок по нижней кнопке
deleteCompletedNode.addEventListener("click", () => {
  deleteSelectedButton();
});

// удаление по кнопке всего контента
deleteAllNode.addEventListener("click", () => {
  toDoListNode.innerHTML = "";
  taskArr = [];
  renderTasks(taskArr);
  removeButtons();
});

// функция для удаления нижних кнопок
function removeButtons() {
  if (taskArr.length !== 0) {
    toDoListNode.classList.remove("toDo__list-none");
    deleteButtonsNode.classList.remove("footer__show");
  } else if (taskArr.length == 0) {
    toDoListNode.classList.add("toDo__list-none");
    deleteButtonsNode.classList.add("footer__show");
  }
}

renderTasks(taskArr);
