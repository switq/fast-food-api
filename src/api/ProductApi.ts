import { ProductController } from "@controllers/ProductController";
import { Express, Request, Response } from "express";
import { DbConnection } from "@interfaces/dbconnection";

/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Operações de produtos
 *   - name: Categories
 *     description: Operações de categorias
 *   - name: Customers
 *     description: Operações de clientes
 *   - name: Orders
 *     description: Operações de pedidos
 *
 * /api/products:
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
 * /api/products/{id}:
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
 *
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Lista todas as categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     tags: [Categories]
 *     summary: Cria uma nova categoria
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
 *
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Busca uma categoria por ID
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
 *
 * /api/customers:
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
 *
 * /api/customers/{id}:
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
 *
 * /api/orders:
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
 * /api/orders/{id}:
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
export function ProductApi(app: Express,dbconnection: DbConnection) {


  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const result = await ProductController.listAll(dbconnection);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const result = await ProductController.getById(req.params.id, dbconnection);
      if (!result) return res.status(404).json({ error: "Product not found" });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const { name, description, price, categoryId, imageUrl } = req.body;
      const result = await ProductController.create(name, description, price, categoryId, imageUrl, dbconnection);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const { name, description, price, categoryId, imageUrl, isAvailable } = req.body;
      const result = await ProductController.update(req.params.id, name, description, price, categoryId, imageUrl, isAvailable, dbconnection);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      await ProductController.remove(req.params.id, dbconnection);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });
}
