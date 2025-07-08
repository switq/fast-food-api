import { Request, Response } from "express";
import OrderUseCases from "../application/use-cases/OrderUseCases";
import { OrderPresenter } from "../presenters/OrderPresenter";
import { IOrderRepository } from "../domain/repositories/IOrderRepository";
import { IProductRepository } from "../domain/repositories/IProductRepository";
import { ICustomerRepository } from "../domain/repositories/ICustomerRepository";

export class OrderController {
  private readonly orderUseCases: OrderUseCases;
  private readonly orderRepository: IOrderRepository;
  private readonly productRepository: IProductRepository;
  private readonly customerRepository: ICustomerRepository;

  constructor(
    orderUseCases: OrderUseCases,
    orderRepository: IOrderRepository,
    productRepository: IProductRepository,
    customerRepository: ICustomerRepository
  ) {
    this.orderUseCases = orderUseCases;
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.customerRepository = customerRepository;
  }

  public async listAll(_req: Request, res: Response): Promise<Response> {
    try {
      const output = await this.orderUseCases.findAllOrders(this.orderRepository);
      return res.status(200).json(OrderPresenter.listToHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const output = await this.orderUseCases.findOrderById(id, this.orderRepository);
      if (!output) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(OrderPresenter.toHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId, items } = req.body;
      const output = await this.orderUseCases.createOrder(
        items,
        this.orderRepository,
        this.productRepository,
        customerId,
        this.customerRepository
      );
      return res.status(201).json(OrderPresenter.toHttp(output));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
