/**
 * @jest-environment jsdom
 */
import { addTodo, changeTodo, removeAllTodos } from "../functions";
import { Todo } from "../models/Todo";
import * as functions from "../functions";
import { IAddResponse } from "../models/IAddResult";

// addTodo
test("Checks the failsafes of addTodo, and makes sure it returns the right stuff", () => {
  const okText = "Todo text that doesn't fail";
  const failText = "a";
  let todos: Todo[] = [];
  let result = addTodo(okText, todos);
  expect(result.success).toBeTruthy();
  result = addTodo(failText, todos);
  expect(result.success).toBeFalsy();
});

// changeTodo
test("checks if changeTodo changes done to undone and vice versa", () => {
  let todos: Todo[] = [];
  const todoText = "test todo";
  let newTodo = new Todo(todoText, false);
  const initialBoolean = newTodo.done;
  todos.push(newTodo);
  changeTodo(todos[todos.length - 1]);
  expect(todos[todos.length - 1].done).not.toBe(initialBoolean);
  const reversedBoolean = todos[todos.length - 1].done;
  changeTodo(todos[todos.length - 1]);
  expect(todos[todos.length - 1].done).not.toBe(reversedBoolean);
});

// removeAllTodos
test("Checks if removeAllTodos removes all stuff", () => {
  let todos: Todo[] = [];
  const amountOfTodos = 4;
  const startLength = todos.length;
  const text = "test Todo #";
  for (let i = 0; i < amountOfTodos; i += 1) {
    const todoText = text + i;
    let newTodo = new Todo(todoText, false);
    todos.push(newTodo);
  }
  expect(todos.length).toBe(startLength + amountOfTodos);
  removeAllTodos(todos);
  expect(todos.length).toBe(0);
});
