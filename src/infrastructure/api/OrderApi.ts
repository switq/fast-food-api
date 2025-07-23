import { IDatabaseConnection } from "@src/interfaces/IDbConnection";
import { Router } from "express";
import OrderController from "../../presentation/controllers/OrderController";
import PaymentController from "../../presentation/controllers/PaymentController";
import Order from "../../domain/entities/Order";
import OrderItem from "../../domain/entities/OrderItem";
import { OrderGateway } from "../../presentation/gateways/OrderGateway";
import { ProductGateway } from "../../presentation/gateways/ProductGateway";
import { CustomerGateway } from "../../presentation/gateways/CustomerGateway";
import OrderPresenter from "../../presentation/presenters/OrderPresenter";

/**
 * @openapi
 * /orders/sorted:
 *   get:
 *     tags: [Orders]
 *     summary: Lista todos os pedidos em andamento, ordenados por status e data
 *     responses:
 *       200:
 *         description: Lista de pedidos ordenada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro ao buscar pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Lista todos os pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro ao buscar pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   post:
 *     tags: [Orders]
 *     summary: Cria um novo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               customerId:
 *                 type: string
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       201:
 *         description: Pedido criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro na requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   delete:
 *     tags: [Orders]
 *     summary: Remove um pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * /orders/customer/{customerId}:
 *   get:
 *     tags: [Orders]
 *     summary: Lista pedidos de um cliente
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro ao buscar pedidos do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Atualiza o status de um pedido
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
 *                 enum: [PENDING, CONFIRMED, PAYMENT_CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED]
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
 *
 * /orders/{id}/items:
 *   patch:
 *     tags: [Orders]
 *     summary: Adiciona itens a um pedido
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
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: Itens adicionados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro ao adicionar itens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * /orders/{orderId}/items/{itemId}:
 *   patch:
 *     tags: [Orders]
 *     summary: Atualiza a quantidade de um item do pedido
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
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
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Quantidade atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro ao atualizar quantidade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * /orders/{orderId}/payment:
 *   post:
 *     tags: [Orders]
 *     summary: Gera QR Code para pagamento de um pedido
 *     description: |
 *       Cria um pagamento para o pedido especificado usando o Mercado Pago.
 *       O cliente poderá escolher entre todas as opções de pagamento disponíveis.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido para o qual o pagamento será gerado
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *                 example: pix
 *                 description: Opcional - para futuras integrações com outros gateways
 *     responses:
 *       200:
 *         description: Pagamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                   example: "order-123"
 *                   description: ID do pedido
 *                 paymentProviderId:
 *                   type: string
 *                   example: "pref-456"
 *                   description: ID da preferência no Mercado Pago
 *                 qrCode:
 *                   type: string
 *                   example: "https://www.mercadopago.com/checkout/v1/..."
 *                   description: URL para pagamento (pode ser usada como QR code)
 *                 qrCodeBase64:
 *                   type: string
 *                   example: "iVBORw0KGgoAAAANSUhEUgAA..."
 *                   description: QR code em base64
 *       400:
 *         description: Erro ao gerar pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customerId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         status:
 *           type: string
 *         totalAmount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         orderId:
 *           type: string
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *         unitPrice:
 *           type: number
 *         totalPrice:
 *           type: number
 *         observation:
 *           type: string
 */
export function setupOrderRoutes(dbConnection: IDatabaseConnection) {
  const router = Router();

  router.get("/orders/sorted", async (req, res) => {
    try {
      const result = await OrderController.listSortedOrders(dbConnection);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.get("/orders", async (req, res) => {
    try {
      const result = await OrderController.getAllOrders(dbConnection);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.get("/orders/:id", async (req, res) => {
    try {
      const result = await OrderController.getOrderById(
        req.params.id,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });

  router.post("/orders", async (req, res) => {
    try {
      const { items, customerId } = req.body;
      const orderGateway = new OrderGateway(dbConnection);
      const productGateway = new ProductGateway(dbConnection);
      const customerGateway = new CustomerGateway(dbConnection);
      // Valida customerId
      if (
        !customerId ||
        typeof customerId !== "string" ||
        customerId.trim().length === 0
      ) {
        throw new Error(
          "customerId is required and must be a valid UUID string"
        );
      }
      // Verifica se o cliente existe
      const customer = await customerGateway.findById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }
      // Instancia os itens antes de criar o pedido
      const orderItems = await Promise.all(
        items.map(async (item: any) => {
          let unitPrice = item.unitPrice;
          if (unitPrice == null) {
            // Busca o preço do produto se não informado
            const product = await productGateway.findById(item.productId);
            if (!product) throw new Error("Product not found");
            unitPrice = product.price;
          }
          return new OrderItem(
            item.productId,
            item.quantity,
            unitPrice,
            undefined, // orderId será atribuído pelo gateway
            undefined, // id será gerado automaticamente
            item.observation
          );
        })
      );
      // Cria o pedido já com os itens
      const order = new Order(undefined, customerId, orderItems);
      const createdOrder = await orderGateway.create(order);
      res.status(201).json(OrderPresenter.toJSON(createdOrder));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.get("/orders/customer/:customerId", async (req, res) => {
    try {
      const result = await OrderController.getOrdersByCustomer(
        req.params.customerId,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.patch("/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const result = await OrderController.updateOrderStatus(
        req.params.id,
        status,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.patch("/orders/:id/items", async (req, res) => {
    try {
      const { items } = req.body;
      const result = await OrderController.addItemsToOrder(
        req.params.id,
        items,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.patch("/orders/:orderId/items/:itemId", async (req, res) => {
    try {
      const { quantity } = req.body;
      const result = await OrderController.updateItemQuantity(
        req.params.orderId,
        req.params.itemId,
        quantity,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.delete("/orders/:id", async (req, res) => {
    try {
      const result = await OrderController.deleteOrderById(
        req.params.id,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });
  router.post("/orders/:orderId/payment", async (req, res) => {
    try {
      const { paymentMethodId = "all" } = req.body || {};
      const result = await PaymentController.createPayment(
        req.params.orderId,
        paymentMethodId,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      if ((err as Error).message === "Order not found") {
        res.status(404).json({ error: (err as Error).message });
      } else {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  });

  return router;
}
