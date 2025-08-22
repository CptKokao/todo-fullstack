// src/index.ts
import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "./middleware/auth"; // Импорт middleware

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET as string;

app.use(express.json());
app.use(cors()); // Включаем CORS для всех источников (для разработки)

// Тип для расширенного объекта Request
interface AuthRequest extends express.Request {
  userId?: string;
}

// --- Маршруты аутентификации ---

// Регистрация пользователя
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, введите все обязательные поля" });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, userId: user.id, email: user.email });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
});

// Вход пользователя
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, введите email и пароль" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверные учетные данные" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user.id, email: user.email });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ message: "Ошибка сервера при входе" });
  }
});

// --- Маршруты TODO (защищенные) ---
// Получить все задачи текущего пользователя
app.get("/api/todos", auth, async (req: AuthRequest, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: Number(req.userId) },
    });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось получить задачи" });
  }
});

// Создать новую задачу
app.post("/api/add", auth, async (req: AuthRequest, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Поле "title" обязательно' });
  }
  try {
    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: Number(req.userId), // Привязываем задачу к текущему пользователю
      },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось создать задачу" });
  }
});

// Обновить задачу по ID
app.put("/api/update/:id", auth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const userId = Number(req.userId);
  const { title, description, completed } = req.body;
  try {
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Задача не найдена или у вас нет прав" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title, description, completed },
    });
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось обновить задачу" });
  }
});

// Удалить задачу по ID
app.delete("/api/delete/:id", auth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const userId = Number(req.userId);

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Задача не найдена или у вас нет прав" });
    }

    await prisma.todo.delete({
      where: { id },
    });
    res.status(204).send(); // 204 No Content для успешного удаления
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Не удалось удалить задачу" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
