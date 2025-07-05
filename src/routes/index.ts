import { Router } from "express";
import CustomerController from "../controllers/CustomerController";
import CategoryController from "../controllers/CategoryController";
import ProductController from "../controllers/ProductController";
import OrderController from "../controllers/OrderController";
import PaymentController from "../controllers/PaymentController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Gerenciamento de clientes
 *   - name: Categorias
 *     description: Gerenciamento de categorias de produtos
 *   - name: Produtos
 *     description: Gerenciamento de produtos
 *   - name: Pedidos
 *     description: Gerenciamento de pedidos
 *   - name: Pagamentos
 *     description: Operações de pagamento
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado
 */

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Busca um cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Clientes]
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
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       404:
 *         description: Cliente não encontrado
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cliente removido
 *       404:
 *         description: Cliente não encontrado
 */

/**
 * @swagger
 * /clientes/{id}/pedidos:
 *   get:
 *     summary: Lista todos os pedidos de um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos do cliente
 *       404:
 *         description: Cliente não encontrado
 */

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Busca um cliente por email ou CPF
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada
 */

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Busca uma categoria por ID
 *     tags: [Categorias]
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
 *   put:
 *     summary: Atualiza uma categoria
 *     tags: [Categorias]
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
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 *   delete:
 *     summary: Remove uma categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoria removida
 *       404:
 *         description: Categoria não encontrada
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto criado
 */

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Produtos]
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
 *     summary: Atualiza um produto
 *     tags: [Produtos]
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
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /produtos/categoria/{categoryId}:
 *   get:
 *     summary: Lista produtos por ID da categoria
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de produtos da categoria
 *       404:
 *         description: Categoria não encontrada
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido criado
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Busca um pedido por ID
 *     tags: [Pedidos]
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
 *   put:
 *     summary: Atualiza um pedido
 *     tags: [Pedidos]
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
 *               customerId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *       404:
 *         description: Pedido não encontrado
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pedido removido
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}/itens:
 *   post:
 *     summary: Adiciona um item a um pedido
 *     tags: [Pedidos]
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
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item adicionado ao pedido
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}/itens/{itemId}:
 *   delete:
 *     summary: Remove um item de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item removido do pedido
 *       404:
 *         description: Pedido ou item não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}/cancelar:
 *   post:
 *     summary: Cancela um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido cancelado
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}/finalizar:
 *   post:
 *     summary: Finaliza um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido finalizado
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/prontos:
 *   get:
 *     summary: Lista pedidos prontos para retirada
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos prontos
 */

/**
 * @swagger
 * /pedidos/{id}/preparar:
 *   post:
 *     summary: Inicia a preparação de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido em preparação
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}/pronto:
 *   post:
 *     summary: Marca um pedido como pronto
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido marcado como pronto
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}/retirado:
 *   post:
 *     summary: Confirma a retirada de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido retirado confirmado
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pagamentos/{pedidoId}/confirmar:
 *   post:
 *     summary: Confirma o pagamento de um pedido
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagamento confirmado
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica a saúde da API
 *     responses:
 *       200:
 *         description: API está funcionando
 */

// Rotas de Clientes
router.get("/clientes", CustomerController.listAll);
router.get("/clientes/:id", CustomerController.getById);
router.post("/clientes", CustomerController.create);
router.put("/clientes/:id", CustomerController.update);
router.delete("/clientes/:id", CustomerController.remove);
router.get("/clientes/:id/pedidos", CustomerController.listOrders);
router.get("/cliente", CustomerController.getByEmailOrCpf);

// Rotas de Categorias
router.get("/categorias", CategoryController.listAll);
router.get("/categorias/:id", CategoryController.getById);
router.post("/categorias", CategoryController.create);
// Adicione update e delete se existirem métodos no controller

// Rotas de Produtos
router.get("/produtos", ProductController.listAll);
router.get("/produtos/:id", ProductController.getById);
router.get("/produtos/categoria/:categoryId", ProductController.listByCategory);
router.post("/produtos", ProductController.create);
// Adicione update e delete se existirem métodos no controller

// Rotas de Pedidos
router.get("/pedidos", OrderController.listAll);
router.get("/pedidos/:id", OrderController.getById);
router.post("/pedidos", OrderController.create);
// Adicione as rotas de itens, cancelar, finalizar, etc, conforme o controller

// Rotas de Pagamento
router.post("/pagamentos/:pedidoId/confirmar", PaymentController.confirmPayment);

// Health check
router.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

export default router;
