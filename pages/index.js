import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constant.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../utils/Section.js";
import Popup from "../components/Popup.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";
const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopupEl.querySelector(".popup__form");
const addTodoCloseBtn = addTodoPopupEl.querySelector(".popup__close");
const todosList = document.querySelector(".todos__list");
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

const addTodoPopup = new PopupWithForm(
  { popupSelector: "#add-todo-popup" },
  {
    handleFormSubmit: (inputValue) => {
      todoCounter.updateTotal(true);

      // Check form validity before proceeding
      if (!addTodoForm.checkValidity()) {
        // Optionally, trigger native validation UI
        addTodoForm.reportValidity();
        return;
      }

      const name = inputValue.name;
      const dateInput = inputValue.date;

      // Create a date object and adjust for timezone
      const date = new Date(dateInput);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      const id = uuidv4();
      const values = { name, date, id, completed: false };
      renderTodo(values);

      addTodoPopup.close();
      newTodoValidator.resetValidation();
    },
  }
);
addTodoPopup.setEventListeners();
const generateTodo = (data) => {
  const todo = new Todo(
    data,
    "#todo-template",
    {
      handleCheck: (completed) => {
        todoCounter.updateCompleted(completed);
      },
    },
    {
      handleDelete: (completed) => {
        if (completed) {
          todoCounter.updateCompleted(false);
          todoCounter.updateTotal(false);
        }
      },
    }
  );
  const todoElement = todo.getView();

  return todoElement;
};
const sectionIns = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todo = generateTodo(item);

    todosList.append(todo);
  },
  containerSelector: ".todos__list",
});
sectionIns.renderItems();

const renderTodo = (item) => {
  const todo = generateTodo(item);
  sectionIns.addItem(todo);
};

addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

addTodoCloseBtn.addEventListener("click", () => {
  addTodoPopup.close();
});

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();
