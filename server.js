import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import opeRoutes from "./routes/operations.js"
import dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: `http://${DB_HOST}:5173`,
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/operations", opeRoutes);

app.listen(8000, () => console.log(`Listening on http://${DB_HOST}:8000`));
