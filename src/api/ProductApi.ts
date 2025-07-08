import { Router } from "express";
import { ProductController } from "@controllers/ProductController";

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Lista todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *   post:
 *     tags: [Products]
 *     summary: Cria um novo produto
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
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto criado
 *
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Busca um produto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 *   put:
 *     tags: [Products]
 *     summary: Atualiza um produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produto atualizado
 *   delete:
 *     tags: [Products]
 *     summary: Remove um produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto removido
 */
export function setupProductRoutes(controller: ProductController) {
  const router = Router();
  router.get("/products", controller.listAll.bind(controller));
  router.get("/products/:id", controller.getById.bind(controller));
  router.post("/products", controller.create.bind(controller));
  router.put("/products/:id", controller.update.bind(controller));
  router.delete("/products/:id", controller.remove.bind(controller));
  return router;
}
