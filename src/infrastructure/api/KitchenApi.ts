import { IDatabaseConnection } from "@src/interfaces/IDbConnection";
import { Router } from "express";
import KitchenController from "../../presentation/controllers/KitchenController";

/**
 * @openapi
 * /kitchen/orders/{id}/status:
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
