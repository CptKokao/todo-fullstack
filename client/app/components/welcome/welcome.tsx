// todo-frontend/src/Welcome.tsx
import React, { useState, useEffect } from "react";

import { AuthForm } from "../authForm/authForm";
import { TodoList } from "../todoList/todoList";

// Interface for Todo (remains the same)
interface Todo {
  id: string; // Or number if using PostgreSQL
  title: string;
  description?: string;
  completed: boolean;
}

// Interface for Auth Response (remains the same)
interface AuthResponseData {
  token: string;
  userId: string;
  email: string;
}

export function Welcome() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const API_BASE_URL = "http://localhost:8000/api"; // Common base URL for API

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchTodos(storedToken); // Pass token directly to fetchTodos
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

  const handleAuthResponse = (data: AuthResponseData) => {
    localStorage.setItem("jwt_token", data.token);
    setToken(data.token);
    setIsLoggedIn(true);
    setEmail("");
    setPassword("");
    setMessage("");
    fetchTodos(data.token); // Pass the new token to fetch todos
  };

  const handleAuthError = async (response: Response) => {
    const errorData = await response.json();
    setMessage(errorData.message || "An error occurred.");
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: AuthResponseData = await response.json();
        handleAuthResponse(data);
      } else {
        handleAuthError(response);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Network error during registration.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: AuthResponseData = await response.json();
        handleAuthResponse(data);
      } else {
        handleAuthError(response);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Network error during login.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setIsLoggedIn(false);
    setTodos([]);
    setMessage("You have been logged out.");
  };

  const addTodo = async (title: string, description: string) => {
    if (!title.trim() || !token) {
      setMessage("Task title cannot be empty, or you are not authorized.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
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
        setTodos([...todos, newTodo]);
        setMessage("");
        return true; // Indicate success
      } else if (response.status === 401) {
        handleLogout();
        setMessage("Session expired. Please log in again.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add todo");
      }
    } catch (error: any) {
      console.error("Error adding todo:", error);
      setMessage(`Error adding todo: ${error.message || "Unknown error"}`);
      return false; // Indicate failure
    }
  };

  const toggleTodoCompletion = async (id: string, completed: boolean) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Todo App
        </h1>

        {message && (
          <p className="bg-blue-100 text-blue-700 p-3 rounded-md mb-4 text-sm text-center">
            {message}
          </p>
        )}

        {!isLoggedIn ? (
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
          />
        ) : (
          <TodoList
            todos={todos}
            addTodo={addTodo}
            updateTodo={updateTodo}
            toggleTodoCompletion={toggleTodoCompletion}
            deleteTodo={deleteTodo}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
