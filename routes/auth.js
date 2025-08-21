import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { z } from "zod";
export const registerSchema = z.object({
  email: z.string().email(),
  password: z
  .string()
  .min(8)
  .regex(/[A-Z]/)           
  .regex(/[a-z]/)           
  .regex(/[0-9]/)           
  .regex(/[^A-Za-z0-9]/)
});
export const loginSchema = registerSchema;

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid data",
        details: parsed.error.errors,
      })
    }
    const { email, password } = parsed.data;
    const existing = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);

    if (existing.rowCount) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2)", [email, hash]);
    res.json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ error: "Cannot register" });
  }

});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,     // poner en true si usas HTTPS
    sameSite: "strict"
  });

  res.json({ message: "Login successful" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

export default router;
