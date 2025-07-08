import { UUIDService } from "../../../domain/services/UUIDService";
import Customer from "../../../domain/entities/Customer";
import { ICustomerRepository } from "../../repositories/ICustomerRepository";

class CustomerUseCases {
  constructor(
    private readonly repository: ICustomerRepository,
    private readonly uuidService: UUIDService
  ) {}

  async createCustomer(
    name: string,
    email: string,
    cpf: string,
    phone: string | undefined
  ): Promise<Customer> {
    const existingEmail = await this.repository.findByEmail(email);
    if (existingEmail) {
      throw new Error("A customer with this email already exists");
    }
    const existingCPF = await this.repository.findByCPF(cpf);
    if (existingCPF) {
      throw new Error("A customer with this CPF already exists");
    }
    const customer = Customer.create(name, email, cpf, phone, this.uuidService);
    return this.repository.create(customer);
  }

  async findCustomerById(id: string): Promise<Customer> {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async findCustomerByEmail(email: string): Promise<Customer> {
    const customer = await this.repository.findByEmail(email);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async findCustomerByCPF(cpf: string): Promise<Customer> {
    const customer = await this.repository.findByCPF(cpf);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.repository.findAll();
  }

  async updateCustomer(
    id: string,
    name: string | undefined,
    email: string | undefined,
    cpf: string | undefined,
    phone: string | undefined
  ): Promise<Customer> {
    const existingCustomer = await this.repository.findById(id);
    if (!existingCustomer) {
      throw new Error("Customer not found");
    }
    if (email !== undefined && email !== existingCustomer.email) {
      const customerWithSameEmail = await this.repository.findByEmail(email);
      if (customerWithSameEmail) {
        throw new Error("A customer with this email already exists");
      }
      existingCustomer.email = email;
    }
    if (cpf !== undefined && cpf !== existingCustomer.cpf) {
      const customerWithSameCPF = await this.repository.findByCPF(cpf);
      if (customerWithSameCPF) {
        throw new Error("A customer with this CPF already exists");
      }
      existingCustomer.cpf = cpf;
    }
    if (name !== undefined) {
      existingCustomer.name = name;
    }
    if (phone !== undefined) {
      existingCustomer.phone = phone;
    }
    return this.repository.update(existingCustomer);
  }

  async deleteCustomer(id: string): Promise<void> {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    await this.repository.delete(id);
  }
}

export default CustomerUseCases;
