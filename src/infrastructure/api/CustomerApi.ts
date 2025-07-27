import { IDatabaseConnection } from "@interfaces/IDbConnection";
import { Router } from "express";
import CustomerController from "@controllers/CustomerController";

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
 *   put:
 *     tags: [Customers]
 *     summary: Atualiza um cliente
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
 *       400:
 *         description: Erro na atualização
 *   delete:
 *     tags: [Customers]
 *     summary: Remove um cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
export function setupCustomerRoutes(dbConnection: IDatabaseConnection) {
  const router = Router();

  router.get("/customers", async (req, res) => {
    try {
      const result = await CustomerController.getAllCustomers(dbConnection);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.get("/customers/:id", async (req, res) => {
    try {
      const result = await CustomerController.getCustomerById(
        req.params.id,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });

  router.post("/customers", async (req, res) => {
    try {
      const { name, email, cpf, phone } = req.body;
      const result = await CustomerController.createCustomer(
        name,
        email,
        cpf,
        phone,
        dbConnection
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.put("/customers/:id", async (req, res) => {
    try {
      const { name, email, cpf, phone } = req.body;
      const result = await CustomerController.updateCustomer(
        req.params.id,
        name,
        email,
        cpf,
        phone,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  router.delete("/customers/:id", async (req, res) => {
    try {
      const result = await CustomerController.deleteCustomerById(
        req.params.id,
        dbConnection
      );
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });

  return router;
}
