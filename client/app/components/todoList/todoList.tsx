// todo-frontend/src/components/TodoList.tsx
import React, { useState } from "react";
import { TodoItem } from "../todoItem/todoItem"; // Импортируем TodoItem

// Интерфейс для Todo (оставляем как есть)
interface Todo {
  id: string; // Или number, если вы используете PostgreSQL
  title: string;
  description?: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  addTodo: (title: string, description: string) => Promise<boolean>;
  toggleTodoCompletion: (id: string, completed: boolean) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, title: string, description: string) => void; // НОВОЕ: функция для обновления
  handleLogout: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  addTodo,
  toggleTodoCompletion,
  deleteTodo,
  updateTodo, // НОВОЕ
  handleLogout,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null); // НОВОЕ: Состояние для ID редактируемой задачи

  const handleAddTodo = async () => {
    const success = await addTodo(newTodoTitle, newTodoDescription);
    if (success) {
      setNewTodoTitle("");
      setNewTodoDescription("");
    }
  };

  return (
    <div>
      <div className="text-right mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        My Tasks
      </h2>
      <div className="flex flex-col space-y-3 mb-6">
        <input
          type="text"
          placeholder="Task title"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTodo}
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Task
        </button>
      </div>
      <ul className="space-y-3">
        {todos.length === 0 && (
          <p className="text-gray-500 text-center">No tasks yet!</p>
        )}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodoCompletion={toggleTodoCompletion}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo} // НОВОЕ
            isEditing={editingTodoId === todo.id} // НОВОЕ
            setEditingTodoId={setEditingTodoId} // НОВОЕ
          />
        ))}
      </ul>
    </div>
  );
};
