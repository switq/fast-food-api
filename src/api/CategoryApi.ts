import { CategoryController } from "@controllers/CategoryController";
import { Express, Request, Response } from "express";
import { DbConnection } from "@interfaces/dbconnection";

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Lista todas as categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     summary: Cria uma nova categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada
 *
 * /api/categories/{id}:
 *   get:
 *     summary: Busca uma categoria por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
export function CategoryApi(app: Express,dbconnection: DbConnection) {

  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const result = await CategoryController.listAll(dbconnection);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const result = await CategoryController.getById(req.params.id, dbconnection);
      if (!result) return res.status(404).json({ error: "Category not found" });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const result = await CategoryController.create(name, description, dbconnection);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
}
