/**
 * @jest-environment jsdom
 */

import { addTodo, changeTodo, removeAllTodos } from "../functions";
import { Todo } from "../models/Todo";
import * as functions from "../functions";
import * as main from "../main";
import { IAddResponse } from "../models/IAddResult";
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
});

// Clear button
test("check if clear button exists, and clearTodos is called on button click", () => {
  const button = document.getElementById("clearTodos");
  // Setup
  if (button) {
    const spy = jest.spyOn(button, "addEventListener");

    const clearTodosMock = jest.fn();
    button.addEventListener("click", () => {
      clearTodosMock();
    });
    expect(button).toBeDefined();
    expect(spy).toHaveBeenCalled();
    expect(clearTodosMock).not.toHaveBeenCalled();
    button.dispatchEvent(new Event("click"));
    expect(clearTodosMock).toHaveBeenCalledWith();

    spy.mockClear();
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
  const spy = jest.spyOn(main, "toggleTodo");
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
