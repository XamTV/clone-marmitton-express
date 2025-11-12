import express from "express";
import { dbPromise } from "../index.js";

const { Router } = express;
export const ingredientsRouter = Router();

ingredientsRouter.get("/", async (req, res) => {
  const db = await dbPromise;
  const ingredients = await db.all("SELECT * FROM ingredients");
  res.json(ingredients);
});

ingredientsRouter.get("/:id", async (req, res) => {
  const db = await dbPromise;
  const id = req.params.id;
  const ingredient = await db.get("SELECT * FROM ingredients WHERE id = ?", [
    id,
  ]);
  res.json(ingredient);
});

ingredientsRouter.post("/", async (req, res) => {
  const db = await dbPromise;
  const data = req.body.data;
  await db.run("INSERT INTO ingredients (name) VALUES (?)", [data.name]);
  res.json({ message: "Ingrédient ajouté" });
});

ingredientsRouter.put("/:id", async (req, res) => {
  const db = await dbPromise;
  const id = req.params.id;
  const data = req.body.data;
  await db.run("UPDATE ingredients SET name = ? WHERE id = ?", [data.name, id]);
  res.json({ message: "Ingrédient mis à jour" });
});

ingredientsRouter.patch("/:id", async (req, res) => {
  const db = await dbPromise;
  const id = req.params.id;
  const data = req.body.data;

  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "Aucun champ à mettre à jour" });
  }

  values.push(id);
  const sql = `UPDATE ingredients SET ${fields.join(", ")} WHERE id = ?`;
  await db.run(sql, values);
  res.json({ message: "Ingrédient mis à jour partiellement" });
});

ingredientsRouter.delete("/:id", async (req, res) => {
  const db = await dbPromise;
  const id = req.params.id;
  await db.run("DELETE FROM ingredients WHERE id = ?", [id]);
  res.json({ message: "Ingrédient supprimé" });
});
