import { Request, Response } from "express";
import CustomerUseCases from "../../application/use-cases/CustomerUseCases";
import { CustomerPresenter } from "../presenters/CustomerPresenter";
import { ICustomerRepository } from "../../application/repositories/ICustomerRepository";

export class CustomerController {
  private readonly customerUseCases: CustomerUseCases;
  private readonly customerRepository: ICustomerRepository;

  constructor(
    customerUseCases: CustomerUseCases,
    customerRepository: ICustomerRepository
  ) {
    this.customerUseCases = customerUseCases;
    this.customerRepository = customerRepository;
  }

  public async listAll(_req: Request, res: Response): Promise<Response> {
    try {
      const output = await this.customerUseCases.findAllCustomers(
        this.customerRepository
      );
      return res.status(200).json(CustomerPresenter.listToHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const output = await this.customerUseCases.findCustomerById(
        id,
        this.customerRepository
      );
      if (!output) {
        return res.status(404).json({ message: "Customer not found" });
      }
      return res.status(200).json(CustomerPresenter.toHttp(output));
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, cpf, phone } = req.body;
      const output = await this.customerUseCases.createCustomer(
        name,
        email,
        cpf,
        phone,
        this.customerRepository
      );
      return res.status(201).json(CustomerPresenter.toHttp(output));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
