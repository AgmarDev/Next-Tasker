"use client";

import React, { useState, useEffect } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const startEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditingId(null);
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
          onKeyDown={(e) => {
            if (e.key == "Enter") addTodo();
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addTodo}
        >
          Додати
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-sm animate-pulse">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Будьласка почекайте даннi завнтажуються
        </div>
      ) : (
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

              {editingId === item.id ? (
                <input
                  autoFocus
                  className="bg-zinc-800 border border-blue-500 text-sm px-2 py-1 rounded w-full outline-none"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(item.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => startEdit(item.id, item.text)}
                  className={`text-sm cursor-pointer select-none ${
                    item.completed ? "line-through text-zinc-500" : ""
                  }`}
                >
                  {item.text}
                </span>
              )}
              <button
                className="opacity-0 group-hover:opacity-100 bg-red-950/30 hover:bg-red-600 text-red-500 hover:text-white text-xs font-medium px-3 py-1.5 rounded-md border border-red-900/50 transition-all"
                onClick={() => deleteTodo(item.id)}
              >
                Delete task
              </button>
            </li>
          ))}
        </ul>
      )}
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
    </main>
  );
}
