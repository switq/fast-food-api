import { Router } from "express";
import { OrderController } from "../../presentation/controllers/OrderController";

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Lista todos os pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *   post:
 *     tags: [Orders]
 *     summary: Cria um novo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               customerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado
 *
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Busca um pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
export function setupOrderRoutes(controller: OrderController) {
  const router = Router();
  router.get("/orders", controller.listAll.bind(controller));
  router.get("/orders/:id", controller.getById.bind(controller));
  router.post("/orders", controller.create.bind(controller));
  // Add PUT, DELETE if needed
  return router;
}
