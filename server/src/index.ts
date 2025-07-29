import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log("server started on PORT " + PORT));

const prisma = new PrismaClient();
