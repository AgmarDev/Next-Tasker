export default function TodoPage() {
  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Список завдань</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1"
          placeholder="Нове завдання"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Додати
        </button>
      </div>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 border p-2">
          <input type="checkbox" />
          <span>Тестове завдання</span>
        </li>
      </ul>
    </main>
  );
}
