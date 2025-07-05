import { Request, Response } from "express";
import CustomerUseCases from "../application/use-cases/CustomerUseCases";
import { CustomerRepository } from "../infrastructure/database/prisma/implementations/CustomerRepository";
import { OrderRepository } from "../infrastructure/database/prisma/implementations/OrderRepository";
import { CustomerPresenter } from "../presenters/CustomerPresenter";

const customerUseCases = new CustomerUseCases();
const customerRepository = new CustomerRepository();
const orderRepository = new OrderRepository();

export default class CustomerController {
  static async listAll(req: Request, res: Response) {
    try {
      const customers = await customerUseCases.findAllCustomers(customerRepository);
      res.json(CustomerPresenter.listToHttp(customers));
    } catch (err: any) {
      res.status(500).json(CustomerPresenter.error(err));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const customer = await customerUseCases.findCustomerById(req.params.id, customerRepository);
      res.json(CustomerPresenter.toHttp(customer));
    } catch (err: any) {
      res.status(404).json(CustomerPresenter.error(err));
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, email, cpf, phone } = req.body;
      const customer = await customerUseCases.createCustomer(name, email, cpf, phone, customerRepository);
      res.status(201).json(CustomerPresenter.toHttp(customer));
    } catch (err: any) {
      res.status(400).json(CustomerPresenter.error(err));
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { name, email, cpf, phone } = req.body;
      const customer = await customerUseCases.updateCustomer(req.params.id, name, email, cpf, phone, customerRepository);
      res.json(CustomerPresenter.toHttp(customer));
    } catch (err: any) {
      res.status(400).json(CustomerPresenter.error(err));
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      await customerUseCases.deleteCustomer(req.params.id, customerRepository);
      res.status(204).send();
    } catch (err: any) {
      res.status(404).json(CustomerPresenter.error(err));
    }
  }

  static async listOrders(req: Request, res: Response) {
    try {
      const orders = await orderRepository.findByCustomerId(req.params.id);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getByEmailOrCpf(req: Request, res: Response) {
    try {
      const { email, cpf } = req.query;
      let customer = null;
      if (email) {
        customer = await customerUseCases.findCustomerByEmail(String(email), customerRepository);
      } else if (cpf) {
        customer = await customerUseCases.findCustomerByCPF(String(cpf), customerRepository);
      }
      if (!customer) return res.status(404).json({ error: "Cliente não encontrado." });
      res.json(customer);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
