import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { API_BASE_URL } from "../../shared/api";
import { TodoList } from "../TodoList/TodoList";

export interface Todo {
  id: string;
  description: string;
  title: string;
  completed: boolean;
  isOffline?: boolean;
}

export function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      setToken(storedToken);

      fetchTodos(storedToken);
    }
  }, []);

  const updateTodo = async (id: string, title: string, description: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }), // Отправляем только title и description
      });
      if (response.ok) {
        const updatedTodo: Todo = await response.json();
        setTodos(
          todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  title: updatedTodo.title,
                  description: updatedTodo.description,
                }
              : todo
          )
        );
        setMessage("");
      } else if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update todo");
      }
    } catch (error: any) {
      console.error("Error updating todo:", error);
      setMessage(`Error updating todo: ${error.message || "Unknown error"}`);
    }
  };

  const fetchTodos = async (currentToken: string | null = token) => {
    if (!currentToken) {
      setTodos([]);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      if (response.ok) {
        const data: Todo[] = await response.json();
        setTodos(data);
      } else if (response.status === 401) {
        handleLogout();
        setMessage("Your session has expired. Please log in again.");
      } else {
        throw new Error("Failed to fetch todos");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setMessage("Error fetching todos.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    return navigate(`/`);
  };

  const addTodo = async (title: string, description: string) => {
    if (!title.trim() || !token) {
      setMessage("Task title cannot be empty, or you are not authorized.");
      return;
    }
    // try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });

    if (response.ok) {
      const newTodo: Todo = await response.json();
      setTodos((prevTodos) => [
        ...prevTodos.filter((t) => !t.isOffline),
        newTodo,
      ]); // Обновляем, удаляя временную офлайн-задачу
      setMessage("");
    } else if (response.status === 401) {
      handleLogout();
      setMessage("Session expired. Please log in again.");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add todo");
    }
  };

  const toggleTodoCompletion = async (id: string, completed: boolean) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
      } else if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
      } else {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      setMessage("Error updating todo.");
    }
  };

  const deleteTodo = async (id: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
      } else {
        throw new Error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      setMessage("Error deleting todo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center font-[Honk]">
          Todo App
        </h1>
        {message && <span>{message}</span>}
        <TodoList
          todos={todos}
          setTodos={setTodos}
          addTodo={addTodo}
          updateTodo={updateTodo}
          toggleTodoCompletion={toggleTodoCompletion}
          deleteTodo={deleteTodo}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}
