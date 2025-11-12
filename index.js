import express, { Router } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { recipesRouter } from "./routes/recette.js";
import { ingredientsRouter } from "./routes/ingredients.js";

const app = express();
app.use(express.json());

export const dbPromise = open({
  filename: "./db.db",
  driver: sqlite3.Database,
});

try {
  const db = await dbPromise;
  await db.exec(`
CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  preparationTime INTEGER,
  difficulty INTEGER,
  budget INTEGER,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipeId INTEGER NOT NULL,
  ingredientId INTEGER NOT NULL,
  quantity TEXT,
  PRIMARY KEY (recipeId, ingredientId),
  FOREIGN KEY (recipeId) REFERENCES recipes(id),
  FOREIGN KEY (ingredientId) REFERENCES ingredients(id)
);
  `);
} catch (err) {
  console.error("Erreur lors de la création de la table :", err);
}

const apiRouter = Router();

apiRouter.use("/ingredients", ingredientsRouter);
apiRouter.use("/recettes", recipesRouter);
app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("✅ Serveur Express connecté à SQLite sur http://localhost:3000");
});
