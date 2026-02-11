"use client";

import React, { useState, useEffect } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

interface TodoFormProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  addTodo: () => void;
}

interface TodoListProps {
  todos: Todo[];
  editingId: string | null;
  editText: string;
  setEditText: (value: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  startEdit: (id: string, text: string) => void;
  saveEdit: (id: string) => void;
  setEditingId: (id: string | null) => void;
}

interface TodoItemProps {
  item: Todo;
  isEditing: boolean;
  editText: string;
  setEditText: (value: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

type FilterType = "всі" | "активні" | "виконані";

export default function TodoPage() {
  //Tasks list state
  const [todos, setTodos] = useState<Todo[]>([]);

  //Task text state
  const [inputValue, setInputValue] = useState<string>("");

  //Eding states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  //Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Filter state
  const [filter, setFilter] = useState<FilterType>("всі");

  //Load from loacal
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("FAILED_TO_PARSE_LOGS", error);
      }
    }
    setIsLoading(false);
  }, []);

  //Saves todo to local store
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  //Core functions
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

  const filteredTodos = todos.filter((todo) => {
    if (filter === "активні") return !todo.completed;
    if (filter === "виконані") return todo.completed;
    return true;
  });

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Список завдань</h1>

      <TodoForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        addTodo={addTodo}
      />

      <div className="flex gap-2 mb-6 text-xs font-mono">
        {(["всі", "активні", "виконані"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border transition-all ${
              filter === f
                ? "bg-blue-600 border-blue-500 text-white"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-sm animate-pulse">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Будьласка почекайте даннi завнтажуються
        </div>
      ) : (
        <TodoList
          todos={filteredTodos}
          editingId={editingId}
          editText={editText}
          setEditText={setEditText}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          startEdit={startEdit}
          saveEdit={saveEdit}
          setEditingId={setEditingId}
        />
      )}

      <TodoCounter todos={todos} />
    </main>
  );
}

function TodoForm({ inputValue, setInputValue, addTodo }: TodoFormProps) {
  return (
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
        className="bg-blue-500 text-white px-4 py-2 rounded transition-shadow hover:bg-blue-400"
        onClick={addTodo}
      >
        Додати
      </button>
    </div>
  );
}

function TodoItem({
  item,
  isEditing,
  editText,
  setEditText,
  onToggle,
  onDelete,
  onStartEdit,
  onSave,
  onCancel,
}: TodoItemProps) {
  return (
    <li className="flex items-center justify-between gap-4 border border-zinc-800 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors group">
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-900"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
        />

        {isEditing ? (
          <input
            autoFocus
            className="bg-zinc-800 border border-blue-500 text-sm px-2 py-1 rounded w-full outline-none"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => onSave(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave(item.id);
              if (e.key === "Escape") onCancel();
            }}
          />
        ) : (
          <span
            onDoubleClick={() => onStartEdit(item.id, item.text)}
            className={`text-sm cursor-pointer select-none ${
              item.completed ? "line-through text-zinc-500" : ""
            }`}
          >
            {item.text}
          </span>
        )}
      </div>
      <button
        className="opacity-0 group-hover:opacity-100 bg-red-950/30 hover:bg-red-600 text-red-500 hover:text-white text-xs font-medium px-3 py-1.5 rounded-md border border-red-900/50 transition-all"
        onClick={() => onDelete(item.id)}
      >
        Видалити
      </button>
    </li>
  );
}

function TodoList({ todos, editingId, ...props }: TodoListProps) {
  return (
    <ul className="space-y-2">
      {todos.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          isEditing={editingId === item.id}
          onToggle={props.toggleTodo}
          onDelete={props.deleteTodo}
          onStartEdit={props.startEdit}
          onSave={props.saveEdit}
          onCancel={() => props.setEditingId(null)}
          editText={props.editText}
          setEditText={props.setEditText}
        />
      ))}
    </ul>
  );
}

function TodoCounter({ todos }: { todos: Todo[] }) {
  return (
    <div className="mt-4 pt-4 border-t border-zinc-800 text-sm">
      {todos.length === 0 ? (
        <span className="text-zinc-500">Ваш список порожній</span>
      ) : (
        <div className="space-y-1">
          <p className="text-zinc-400">
            Загальна кількість завдань: {todos.length}
          </p>
          <p className=" text-zinc-400">
            Залишилось виконати: {todos.filter((t) => !t.completed).length}
          </p>
        </div>
      )}
    </div>
  );
}
