// todo-frontend/src/components/AuthForm.tsx
import React from "react";

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: () => void;
  handleRegister: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleRegister,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
        Login / Register
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
};
