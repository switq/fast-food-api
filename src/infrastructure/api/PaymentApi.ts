import { IDatabaseConnection } from "@src/interfaces/IDbConnection";
import { Router } from "express";
import PaymentController from "../../presentation/controllers/PaymentController";

/**
 * @openapi
 * /payments/order/{orderId}/status:
 *   get:
 *     tags: [Payments]
 *     summary: Consulta o status de pagamento de um pedido
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentStatus:
 *                   type: string
 *       404:
 *         description: Pedido não encontrado
 *
 * /payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Recebe notificações de pagamento do Mercado Pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *     responses:
 *       200:
 *         description: Notificação recebida com sucesso
 */
export function setupPaymentRoutes(dbConnection: IDatabaseConnection) {
  const router = Router();

  router.get("/payments/order/:orderId/status", async (req, res) => {
    try {
      const paymentStatus = await PaymentController.getPaymentStatus(
        req.params.orderId,
        dbConnection
      );
      if (paymentStatus) {
        res.json({ paymentStatus });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.post("/payments/webhook", async (req, res) => {
    try {
      const paymentId = req.body.data?.id;
      if (paymentId) {
        await PaymentController.handleWebhookNotification(
          paymentId,
          dbConnection
        );
      }
      res.status(200).send("ok");
    } catch (err) {
      // It's important to return a 200 status even if there's an error
      // to prevent Mercado Pago from retrying the notification.
      // The error should be logged for debugging purposes.
      console.error("Error handling webhook:", err);
      res.status(200).send("ok");
    }
  });

  return router;
}
