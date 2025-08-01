import { IDatabaseConnection } from "@interfaces/IDbConnection";
import { Router } from "express";
import KitchenController from "@controllers/KitchenController";

/**
 * @openapi
 * /api/kitchen/orders/payment-confirmed:
 *   get:
 *     tags: [Kitchen]
 *     summary: Lista todos os pedidos com status PAYMENT_CONFIRMED para a cozinha
 *     description: Retorna pedidos que estão prontos para serem preparados, incluindo informações dos produtos
 *     responses:
 *       200:
 *         description: Lista de pedidos com status PAYMENT_CONFIRMED
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   orderNumber:
 *                     type: number
 *                   status:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         productId:
 *                           type: string
 *                         productName:
 *                           type: string
 *                         quantity:
 *                           type: integer
 *                         observation:
 *                           type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Erro ao buscar pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * /api/kitchen/orders/{id}/status:
 *   patch:
 *     tags: [Kitchen]
 *     summary: Atualiza o status de um pedido (cozinha)
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PREPARING, READY]
 *     responses:
 *       200:
 *         description: Status atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro na atualização do status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     x-business-logic:
 *       - only allow status transition from PREPARING to READY
 *       - order must be in PREPARING status to be marked as READY
 *       - respond with 400 Bad Request if business rules are violated
 */
export function setupKitchenRoutes(dbConnection: IDatabaseConnection) {
  const router = Router();

  router.get("/kitchen/orders/payment-confirmed", async (req, res) => {
    try {
      const result =
        await KitchenController.getPaymentConfirmedOrders(dbConnection);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.patch("/kitchen/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const result = await KitchenController.updateOrderStatus(
        req.params.id,
        status,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  return router;
}
