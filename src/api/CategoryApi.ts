import { Router } from "express";
import { CategoryController } from "@controllers/CategoryController";

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
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
 *       400:
 *         description: Erro na requisicao
 *
 * /api/categories/{id}:
 *   get:
 *     summary: Busca uma categoria por ID
 *     tags: [Categories]
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
export function setupCategoryRoutes(controller: CategoryController) {
  const router = Router();
  router.get("/categories", controller.listAll.bind(controller));
  router.get("/categories/:id", controller.getById.bind(controller));
  router.post("/categories", controller.create.bind(controller));
  // Adicione os outros métodos (PUT, DELETE) aqui...
  return router;
}
