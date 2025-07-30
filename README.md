---

# Приложение Todo Fullstack

Это полнофункциональное приложение Todo, созданное с использованием **React** на фронтенде и **Node.js (Express)** с **Prisma ORM** на бэкенде. Для хранения данных используется **PostgreSQL**, а аутентификация реализована с помощью **JWT-токенов**.

---

## Возможности

- **Аутентификация пользователя**: Регистрация и вход в систему с использованием JWT-токенов.
- **Управление задачами (CRUD)**:
  - Создание новых задач (Todo).
  - Просмотр списка всех задач текущего пользователя.
  - Редактирование заголовка и описания существующих задач.
  - Отметка задач как выполненных/невыполненных.
  - Удаление задач.
- **Гибкая база данных**: Изначально приложение работало с MongoDB, но теперь полностью переведено на **PostgreSQL** для строгой схемы и надежных миграций.
- **Современный UI**: Фронтенд стилизован с помощью **Tailwind CSS**.
- **Разделение логики**: Приложение разделено на клиентскую и серверную части для четкой архитектуры.

---

## Стек технологий

### Фронтенд (Client)

- **React**: Библиотека для создания пользовательских интерфейсов.
- **TypeScript**: Типизированный JavaScript.
- **Tailwind CSS**: Утилитарный CSS-фреймворк для быстрой стилизации.
- **Vite**: Быстрый сборщик проектов для React.

### Бэкенд (Server)

- **Node.js**: Среда выполнения JavaScript.
- **Express.js**: Веб-фреймворк для Node.js.
- **Prisma ORM**: Современный ORM для работы с базами данных (используется с PostgreSQL).
- **TypeScript**: Типизированный JavaScript.
- **bcryptjs**: Для хеширования паролей пользователей.
- **jsonwebtoken**: Для работы с JWT-токенами аутентификации.

### База данных

- **PostgreSQL**: Мощная реляционная база данных.
- **Docker / Docker Compose**: Для легкого развертывания локальной базы данных PostgreSQL.

---

## Начало работы

Чтобы запустить это приложение на вашей локальной машине, выполните следующие шаги:

### 1\. Клонируйте репозиторий

```bash
git clone https://github.com/CptKokao/todo-fullstack.git
cd todo-fullstack
```

### 2\. Настройте базу данных PostgreSQL с помощью Docker Compose

Убедитесь, что у вас установлен **Docker Desktop** (или Docker Engine на Linux).

Создайте файл `docker-compose.yml` в **корневом каталоге** проекта (`todo-fullstack/`) со следующим содержимым:

```yaml
# docker-compose.yml
version: "3.8"

services:
  db:
    image: postgres:16-alpine
    container_name: todo-postgresql
    environment:
      POSTGRES_DB: todo-app-db
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always

volumes:
  postgres_data:
```

Запустите контейнер базы данных:

```bash
docker compose up -d
```

Это запустит PostgreSQL на порту `5432`.

### 3\. Настройте бэкенд

Перейдите в каталог бэкенда:

```bash
cd server
```

Установите зависимости:

```bash
npm install
```

Создайте файл `.env` в каталоге `server` и добавьте следующие переменные:

```dotenv
# server/.env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/todo-app-db?schema=public"
PORT=5000
JWT_SECRET="ваш_очень_секретный_ключ" # Замените на длинную, случайную строку
```

**Важно**: Убедитесь, что `POSTGRES_USER`, `POSTGRES_PASSWORD` и `POSTGRES_DB` в `DATABASE_URL` совпадают с теми, что вы указали в `docker-compose.yml`.

Выполните миграции Prisma для создания таблиц в базе данных:

```bash
npx prisma migrate dev --name init_database
```

Запустите бэкенд сервер:

```bash
npm run dev # или npm start
```

Сервер будет работать на `http://localhost:5000`.

### 4\. Настройте фронтенд

Откройте **новое окно терминала** и перейдите в каталог фронтенда:

```bash
cd ../client
```

Установите зависимости:

```bash
npm install
```

Убедитесь, что ваш `API_BASE_URL` в `src/Welcome.tsx` (или `src/App.tsx` если вы не переименовывали) указывает на порт бэкенда:

```typescript
// todo-frontend/src/Welcome.tsx
const API_BASE_URL = "http://localhost:5000/api"; // Убедитесь, что порт соответствует вашему бэкенду
```

Запустите фронтенд приложение:

```bash
npm start
```

Приложение будет доступно по адресу `http://localhost:3000` (или другому порту, указанному Vite).

---

## Использование приложения

1.  Откройте браузер и перейдите по адресу `http://localhost:3000`.
2.  **Зарегистрируйтесь** с новым email и паролем.
3.  **Войдите** в систему, используя зарегистрированные учетные данные.
4.  Вы сможете **добавлять, просматривать, помечать как выполненные/невыполненные, редактировать и удалять** свои задачи.

---

## Структура проекта

```
todo-fullstack/
├── client/                     # Фронтенд часть (React)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Разделенные компоненты UI
│   │   │   ├── AuthForm.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── TodoItem.tsx
│   │   ├── app.css             # Глобальные стили Tailwind CSS
│   │   ├── Welcome.tsx         # Главный компонент приложения
│   │   └── main.tsx
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                     # Бэкенд часть (Node.js/Express)
│   ├── prisma/                 # Файлы Prisma (схема, миграции)
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts         # Middleware для аутентификации
│   │   └── index.ts            # Главный файл сервера
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .dockerignore
├── .gitignore
├── docker-compose.yml          # Конфигурация Docker для PostgreSQL
└── README.md
```

---
