import { useState } from "react";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../../shared/api";

interface AuthResponseData {
  token: string;
  userId: string;
  email: string;
}

export const AuthForm = () => {
  const [email, setEmail] = useState("t@t.ru3");
  const [password, setPassword] = useState("1234");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuthResponse = (data: AuthResponseData) => {
    localStorage.setItem("jwt_token", data.token);

    setEmail("");
    setPassword("");
    setMessage("");
    return navigate(`/todo`);
  };

  const handleAuthError = async (response: Response) => {
    const errorData = await response.json();
    setMessage(errorData.message || "An error occurred.");
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {message && (
          <p className="bg-blue-100 text-blue-700 p-3 rounded-md mb-4 text-sm text-center">
            {message}
          </p>
        )}

        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
          Login / Register
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleLogin}
            className="flex-1 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="flex-1 bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
