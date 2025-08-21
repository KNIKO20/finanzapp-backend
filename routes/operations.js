import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { z } from "zod";
export const opSchema = z.object({
  name: z.string().min(1),
  details: z.string().optional(),
  amount: z.number().nonnegative(),
  date: z.string().datetime(), // ISO 8601
  type: z.enum(["income","expenditure"]),
  category: z.enum(["food","study","home","leisure","transport","health","shopping"]),
});

const router = express.Router();
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Access allowed", user: req.user });
});

router.get("/profile", authMiddleware, async (req, res) => {
    res.json({ email: req.user.email, id: req.user.id });
});

router.get("/show", authMiddleware, async (req, res) => {
  try {
    const userId = String(req.user.id); 
    const { rows } = await pool.query(
      "SELECT * FROM operations WHERE user_id=$1",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Querry error" });
  }
});

router.get("/details/:id", authMiddleware, async (req, res) => {
  try {
    const userId = String(req.user.id); 
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM operations WHERE user_id=$1 AND id=$2",
      [userId, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Querry error" });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const userId = String(req.user.id); 
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM operations WHERE user_id=$1 AND id=$2",
      [userId, id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Querry error" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const userId = String(req.user.id); 
    const parsed = opSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid data",
        details: parsed.error.errors,
      })
    }
    const { name, details, amount, date, type, category } = parsed.data

    const result = await pool.query(
      "INSERT INTO operations(user_id,name,details,amount,date,type,category) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [userId, name, details ?? null, amount, date, type, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Querry error" });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const userId = String(req.user.id); 
    const { id } = req.params;
    const parsed = opSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid data",
        details: parsed.error.errors,
      })
    }
    const { name, details, amount, date, type, category } = parsed.data

    const result = await pool.query(
      "UPDATE operations SET name=$1,details=$2,amount=$3,date=$4,type=$5,category=$6 WHERE user_id=$7 AND id=$8 RETURNING *",
      [name, details ?? null, amount, date, type, category, userId, id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Querry error" });
  }
});
export default router;