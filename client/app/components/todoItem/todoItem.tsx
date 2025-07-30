// todo-frontend/src/components/TodoItem.tsx
import React, { useState } from "react";

// Интерфейс для Todo (оставляем как есть)
interface Todo {
  id: string; // Или number, если вы используете PostgreSQL
  title: string;
  description?: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  toggleTodoCompletion: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, title: string, description: string) => void; // НОВОЕ
  isEditing: boolean; // НОВОЕ: Пропс, указывающий, редактируется ли эта задача
  setEditingTodoId: (id: string | null) => void; // НОВОЕ: Функция для установки ID редактируемой задачи
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodoCompletion,
  deleteTodo,
  updateTodo,
  isEditing,
  setEditingTodoId,
}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(
    todo.description || ""
  );

  const handleSaveEdit = () => {
    // Вызываем функцию обновления из родительского компонента
    updateTodo(todo.id, editedTitle, editedDescription);
    setEditingTodoId(null); // Выходим из режима редактирования
  };

  const handleCancelEdit = () => {
    setEditedTitle(todo.title); // Откатываем изменения
    setEditedDescription(todo.description || ""); // Откатываем изменения
    setEditingTodoId(null); // Выходим из режима редактирования
  };

  return (
    <li className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
      {isEditing ? (
        // Режим редактирования
        <div className="flex flex-col flex-grow space-y-2 mr-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-lg"
          />
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            placeholder="Описание..."
          />
        </div>
      ) : (
        // Режим отображения
        <span
          className={`text-lg font-medium ${
            todo.completed ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {todo.title}{" "}
          {todo.description && (
            <span className="text-sm text-gray-600">({todo.description})</span>
          )}
        </span>
      )}

      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 text-white py-2 px-4 rounded-md text-sm hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white py-2 px-4 rounded-md text-sm hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => toggleTodoCompletion(todo.id, todo.completed)}
              className={`py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 ${
                todo.completed
                  ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500"
                  : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
              }`}
            >
              {todo.completed ? "Unmark" : "Complete"}
            </button>
            <button
              onClick={() => setEditingTodoId(todo.id)} // НОВОЕ: Включаем режим редактирования
              className="bg-purple-500 text-white py-2 px-4 rounded-md text-sm hover:bg-purple-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white py-2 px-4 rounded-md text-sm hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
};
