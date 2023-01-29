/**
 * @jest-environment jsdom
 */

import { Todo } from "../models/Todo";
import * as functions from "../functions";
import * as main from "../main";
beforeEach(() => {
  document.body.innerHTML = "";

  document.body.innerHTML = `<form id="newTodoForm">
      <div>
        <input type="text" id="newTodoText" />
        <button>Skapa</button>
        <button type="button" id="clearTodos">Rensa lista</button>
      </div>
      <div id="error" class="error"></div>
    </form>
    <ul id="todos" class="todo"></ul>`;
});

//Form
test("Check if form exist", () => {
  const form = document.getElementById("newTodoForm") as HTMLFormElement;
  expect(form).toBeDefined();
  const preventDefault = jest.fn();
  const spy = jest.spyOn(form, "addEventListener");

  form.addEventListener("submit", (e) => {
    preventDefault();
  });
  form.dispatchEvent(new Event("submit"));
  expect(spy).toBeCalled();
  expect(preventDefault).toBeCalled();
  spy.mockClear();
});

// Clear button
test("check if clear button exists, and clearTodos is called on button click", () => {
  const button = document.getElementById("clearTodos");
  let todos: Todo[] = [];
  // Setup
  if (button) {
    const spy = jest.spyOn(button, "addEventListener");
    const spytwo = jest.spyOn(main, "clearTodos");
    // const clearTodosMock = jest.fn();
    button.addEventListener("click", () => {
      main.clearTodos(todos);
    });
    expect(button).toBeDefined();
    expect(spy).toHaveBeenCalled();
    expect(spytwo).not.toHaveBeenCalled();
    button.dispatchEvent(new Event("click"));
    expect(spytwo).toHaveBeenCalled();

    spy.mockClear();
    spytwo.mockClear();
  }
});
// createNewTodo
test("checks createNewTodo to call AddTodo", () => {
  let todos: Todo[] = [];
  let text = "test todo";

  const spy = jest.spyOn(functions, "addTodo");
  const length = todos.length;

  main.createNewTodo(text, todos);

  expect(todos.length).toBe(length + 1);
  expect(spy).toBeCalled();
  expect(spy).toReturnWith({ success: true, error: "" });
  spy.mockClear();
});

test("checks failed createNewTodo", () => {
  let todos: Todo[] = [];
  let text = "f";
  const spy = jest.spyOn(functions, "addTodo");
  const length = todos.length;
  main.createNewTodo(text, todos);
  expect(spy).not.toReturnWith({ success: true, error: "" });
  expect(todos.length).toBe(length);
  spy.mockClear();
});

// CreateHtml
test("test if createHtml creates the list", () => {
  let todos: Todo[] = [];
  const oldLength = todos.length;
  const amountOfTodos = 4;
  const text = "test Todo #";
  const oldStorage = localStorage.getItem("todos");
  const oldLiLength = document.querySelectorAll("li").length;

  for (let i = 0; i < amountOfTodos; i += 1) {
    const todoText = text + i;
    let newTodo = new Todo(todoText, false);
    todos.push(newTodo);
  }

  main.createHtml(todos);
  const newLength = todos.length;
  const newStorage = localStorage.getItem("todos");
  const li = document.querySelectorAll("li");
  const newLiLength = li.length;

  expect(newStorage).not.toBe(oldStorage);
  expect(newLiLength).not.toBe(oldLiLength);
  expect(newLength).toBe(oldLength + amountOfTodos);
  for (let i = oldLength; i < newLength; i += 1) {
    expect(li[i].innerHTML).toBe(text + i);
  }
});

// toggleTodo
test("Tests if toggle todo calls two functions", () => {
  const spy = jest.spyOn(functions, "changeTodo");
  const spytwo = jest.spyOn(main, "createHtml");
  let todos: Todo[] = [];
  const amountOfTodos = 4;
  const text = "test Todo #";
  for (let i = 0; i < amountOfTodos; i += 1) {
    const todoText = text + i;
    let newTodo = new Todo(todoText, false);
    todos.push(newTodo);
  }
  main.createHtml(todos);
  //Check if they get "done"
  for (let i = 0; i < amountOfTodos; i += 1) {
    main.toggleTodo(todos[i]);
    expect(todos[i].done).toBeTruthy();
    expect(spy).toBeCalled();
    expect(spytwo).toBeCalled();
  }
  //Toggle them back
  for (let i = 0; i < amountOfTodos; i += 1) {
    main.toggleTodo(todos[i]);
    expect(todos[i].done).toBeFalsy();
    expect(spy).toBeCalled();
    expect(spytwo).toBeCalled();
  }
  spy.mockClear();
  spytwo.mockClear();
});

// displayError
test("display error is hidden by default, is shown when error, and hides again after", () => {
  const errorText = "error test";
  let errorContainer: HTMLDivElement = document.getElementById("error") as HTMLDivElement;

  expect(errorContainer.classList.contains("show")).toBeFalsy();
  main.displayError(errorText, true);
  expect(errorContainer.classList.contains("show")).toBeTruthy();
  expect(errorContainer.innerHTML).toBe(errorText);
  main.displayError("", false);
  expect(errorContainer.classList.contains("show")).toBeFalsy();
  expect(errorContainer.innerHTML).not.toBe(errorText);
});

// clearTodos
test("Test is clearTodos work, and if it is already cleared, not break", () => {
  let todos: Todo[] = [];
  const spy = jest.spyOn(functions, "removeAllTodos");
  const amountOfTodos = 4;
  const text = "test Todo #";
  for (let i = 0; i < amountOfTodos; i += 1) {
    const todoText = text + i;
    let newTodo = new Todo(todoText, false);
    todos.push(newTodo);
  }
  main.clearTodos(todos);
  expect(todos.length).toBe(0);

  main.clearTodos(todos);
  expect(todos.length).toBe(0);
  expect(spy).toBeCalled();
  spy.mockClear();
});
