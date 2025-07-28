import "dotenv/config";
import express from "express";

const app = express();
const PORT = 8000;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
