"use client";

import React, { useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      createdAt: new Date(),
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Список завдань</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1"
          placeholder="Нове завдання"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addTodo}
        >
          Додати
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border border-zinc-800 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900"
              checked={item.completed}
              onChange={() => toggleTodo(item.id)}
            />
            <span
              style={
                item.completed
                  ? { textDecoration: "line-through" }
                  : { textDecoration: "none" }
              }
            >
              {item.text}
            </span>
            <button
              className="opacity-0 group-hover:opacity-100 bg-red-950/30 hover:bg-red-600 text-red-500 hover:text-white text-xs font-medium px-3 py-1.5 rounded-md border border-red-900/50 transition-all"
              onClick={() => deleteTodo(item.id)}
            >
              Delete task
            </button>
          </li>
        ))}
        {todos.length === 0 ? (
          <span>Ваш список порожнiй</span>
        ) : (
          <div>
            <span>Загльна кiлькiсть завдань: {todos.length}</span>
            <br />
            <span>
              Залишилось виконати: {todos.filter((t) => !t.completed).length}
            </span>
          </div>
        )}
      </ul>
    </main>
  );
}
