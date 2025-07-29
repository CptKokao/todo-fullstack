# Приложение TODO

Это простое TODO-приложение с использованием современного стека технологий: **React** для клиентской части, **Node.js (Express)** для серверной части и **MongoDB** в качестве базы данных, управляемой с помощью **Prisma ORM**.

---

## Особенности

- **Полный CRUD-функционал:** Создание, чтение, обновление и удаление задач.
- **Современный стек:** Node.js, React, MongoDB, Prisma.
- **Типизация:** Использование TypeScript как на фронтенде, так и на бэкенде для улучшенной стабильности и разработки.
- **Изолированная база данных:** MongoDB запускается в контейнере Docker для легкости настройки и управления.

---

## Технологии

### Клиентская часть (Frontend)

- **React:** Библиотека для создания пользовательских интерфейсов.
- **TypeScript:** Язык программирования, обеспечивающий статическую типизацию.
- **`fetch` API (или `axios`):** Для взаимодействия с RESTful API бэкенда.

### Серверная часть (Backend)

- **Node.js:** Среда выполнения JavaScript.
- **Express.js:** Легковесный фреймворк для создания веб-приложений и API.
- **TypeScript:** Язык программирования, обеспечивающий статическую типизацию.
- **Prisma ORM:** Современный ORM для взаимодействия с базой данных MongoDB.
- **`dotenv`:** Для управления переменными окружения.
- **`cors`:** Middleware для Express для обработки CORS-запросов.

### База данных

- **MongoDB:** NoSQL документоориентированная база данных.
- **Docker:** Для локального запуска MongoDB в контейнере.

---

## Структура проекта

Проект состоит из двух основных частей:

## Установка и запуск

Для запуска этого приложения вам понадобится установленный **Node.js** и **Docker**.

### 1. Подготовка рабочей среды

1.  **Создайте корневой каталог для проекта:**
    ```bash
    mkdir todo-app
    cd todo-app
    ```
2.  **Создайте файл `docker-compose.yml`** в этом корневом каталоге со следующим содержимым:

    ```yaml
    # docker-compose.yml
    version: "3.8"

    services:
      mongodb:
        image: mongo:latest
        container_name: todo-mongodb
        ports:
          - "27017:27017"
        environment:
          MONGO_INITDB_DATABASE: todo-app-db
        volumes:
          - mongodb_data:/data/db
        restart: always

    volumes:
      mongodb_data:
    ```

3.  **Запустите MongoDB с помощью Docker:**

    ```bash
    docker compose up -d
    ```

    Эта команда скачает образ MongoDB (если его нет) и запустит контейнер MongoDB на порту `27017`.
    Данные базы данных будут сохраняться в именованном томе Docker `mongodb_data`.

    **Строка подключения к БД:** `mongodb://localhost:27017/todo-app-db`

---

### 2. Серверная часть (Backend)

1.  **Инициализируйте проект Node.js с TypeScript:**
    ```bash
    mkdir server
    cd server
    npm init -y
    npm install express dotenv cors @prisma/client
    npm install -D typescript ts-node @types/node @types/express @types/cors prisma ts-node-dev
    npx tsc --init # Создать tsconfig.json
    ```
2.  **Конфигурация tsconfig.json**

    ```json
    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "rootDir": "./src",
        "outDir": "./dist",
        "esModuleInterop": true,
        "strict": true,
        "skipLibCheck": true
      }
    }
    ```

3.  **Конфигурация nodemon.json**

    ```json
    {
      "watch": ["src"],
      "ext": "ts",
      "ignore": ["dist"],
      "exec": "ts-node src/index.ts"
    }
    ```

4.  **Настройте Prisma:**

    ```bash
    npx prisma init --datasource-provider postgresql
    ```

    Это создаст папку `prisma` с файлом `schema.prisma`. Откройте `prisma/schema.prisma` и добавьте следующую модель:

    ```prisma
    // prisma/schema.prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Todo {
      id        String   @id @map("_id") @db.ObjectId
      title     String
      description String?
      completed Boolean  @default(false)
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    ```

5.  **Сгенерируйте Prisma Client:**

    ```bash
    npx prisma generate
    ```

6.  **Создайте файл `.env`** в корне `todo-backend` на основе `.env.example` и укажите строку подключения к базе данных:

    ```dotenv
    # todo-backend/.env
    DATABASE_URL="mongodb://localhost:27017/todo-app-db"
    PORT=5000
    ```

7.  **Запустите сервер:**
    ```bash
    npm start
    # или для режима разработки с автоматическим перезапуском:
    # npm run dev
    ```
    Сервер будет запущен на порту `5000` (или другом, указанном в `.env`).

---
