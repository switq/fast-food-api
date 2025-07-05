import { Request, Response } from "express";
import OrderUseCases from "../application/use-cases/OrderUseCases";
import { OrderRepository } from "../infrastructure/database/prisma/implementations/OrderRepository";
import { ProductRepository } from "../infrastructure/database/prisma/implementations/ProductRepository";
import { CustomerRepository } from "../infrastructure/database/prisma/implementations/CustomerRepository";
import OrderItem from "../domain/entities/OrderItem";
import { OrderStatus } from "../domain/entities/Order";

const orderUseCases = new OrderUseCases();
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const customerRepository = new CustomerRepository();

export default class OrderController {
  static async listAll(req: Request, res: Response) {
    try {
      const orders = await orderUseCases.findAllOrders(orderRepository);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const order = await orderUseCases.findOrderById(req.params.id, orderRepository);
      res.json(order);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { items, customerId } = req.body;
      const orderItems = items.map((item: any) => new OrderItem(undefined, undefined, item.productId, item.quantity, item.price, item.observation));
      const order = await orderUseCases.createOrder(orderItems, orderRepository, productRepository, customerId, customerRepository);
      res.status(201).json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async addItem(req: Request, res: Response) {
    try {
      const { items } = req.body;
      const orderItems = items.map((item: any) => new OrderItem(undefined, req.params.id, item.productId, item.quantity, item.price, item.observation));
      const order = await orderUseCases.addItemsToOrder(req.params.id, orderItems, orderRepository, productRepository);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async removeItem(req: Request, res: Response) {
    try {
      // Para remover item, utilize updateItemQuantity para 0 ou implemente lógica específica
      res.status(501).json({ error: "Remoção de item do pedido não implementada." });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async cancel(req: Request, res: Response) {
    try {
      const order = await orderUseCases.updateOrderStatus(req.params.id, OrderStatus.CANCELLED, orderRepository);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async finalize(req: Request, res: Response) {
    try {
      const order = await orderUseCases.updateOrderStatus(req.params.id, OrderStatus.DELIVERED, orderRepository);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async listReadyForPickup(req: Request, res: Response) {
    try {
      const orders = await orderRepository.findAll();
      const readyOrders = orders.filter((o: any) => o.status === OrderStatus.READY);
      res.json(readyOrders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async startPreparation(req: Request, res: Response) {
    try {
      const order = await orderUseCases.updateOrderStatus(req.params.id, OrderStatus.PREPARING, orderRepository);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async markReady(req: Request, res: Response) {
    try {
      const order = await orderUseCases.updateOrderStatus(req.params.id, OrderStatus.READY, orderRepository);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async confirmPickup(req: Request, res: Response) {
    try {
      const order = await orderUseCases.updateOrderStatus(req.params.id, OrderStatus.DELIVERED, orderRepository);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
