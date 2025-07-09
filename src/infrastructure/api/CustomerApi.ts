import { Router } from "express";
import { CustomerController } from "../../presentation/controllers/CustomerController";

/**
 * @openapi
 * /customers:
 *   get:
 *     tags: [Customers]
 *     summary: Lista todos os clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 *   post:
 *     tags: [Customers]
 *     summary: Cria um novo cliente
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
 *       400:
 *         description: Erro na requisição
 *
 * /customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Busca um cliente por ID
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
 */
export function setupCustomerRoutes(controller: CustomerController) {
  const router = Router();
  router.get("/customers", controller.listAll.bind(controller));
  router.get("/customers/:id", controller.getById.bind(controller));
  router.post("/customers", controller.create.bind(controller));
  // Add PUT, DELETE if needed
  return router;
}
