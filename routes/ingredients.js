import express from "express";
import { dbPromise } from "../index.js";

const { Router } = express;
export const ingredientsRouter = Router();

ingredientsRouter.get("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const ingredients = await db.all("SELECT * FROM ingredients");
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des ingrédients",
      error: error.message,
    });
  }
});

ingredientsRouter.get("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const ingredient = await db.get("SELECT * FROM ingredients WHERE id = ?", [
      id,
    ]);

    if (!ingredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé" });
    }

    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'ingrédient",
      error: error.message,
    });
  }
});

ingredientsRouter.post("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const data = req.body.data;

    const result = await db.run("INSERT INTO ingredients (name) VALUES (?)", [
      data.name,
    ]);

    res.status(201).json({
      message: "Ingrédient ajouté",
      ingredientId: result.lastID,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de l'ingrédient",
      error: error.message,
    });
  }
});

ingredientsRouter.put("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const data = req.body.data;

    const existingIngredient = await db.get(
      "SELECT * FROM ingredients WHERE id = ?",
      [id]
    );

    if (!existingIngredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé" });
    }

    await db.run("UPDATE ingredients SET name = ? WHERE id = ?", [
      data.name,
      id,
    ]);

    res.status(200).json({ message: "Ingrédient mis à jour" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'ingrédient",
      error: error.message,
    });
  }
});

ingredientsRouter.patch("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const data = req.body.data;

    const existingIngredient = await db.get(
      "SELECT * FROM ingredients WHERE id = ?",
      [id]
    );

    if (!existingIngredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé" });
    }

    const updatedName = data.name || existingIngredient.name;

    await db.run("UPDATE ingredients SET name = ? WHERE id = ?", [
      updatedName,
      id,
    ]);

    res.status(200).json({ message: "Ingrédient mis à jour partiellement" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'ingrédient",
      error: error.message,
    });
  }
});

ingredientsRouter.delete("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    await db.run("DELETE FROM ingredients WHERE id = ?", [id]);
    res.status(200).json({ message: "Ingrédient supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'ingrédient",
      error: error.message,
    });
  }
});
