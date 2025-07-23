import { PrismaClient } from "@prisma/client";
import { ICustomerRepository } from "../../../../application/repositories/ICustomerRepository";
import Customer from "../../../../domain/entities/Customer";

export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(item: Customer): Promise<Customer> {
    const result = await this.prisma.customer.create({
      data: {
        id: item.id,
        name: item.name,
        email: item.email,
        cpf: item.cpf,
        phone: item.phone,
      },
    });
    return new Customer(result.id, result.name, result.email, result.cpf, result.phone);
  }

  async findById(id: string): Promise<Customer | null> {
    const result = await this.prisma.customer.findUnique({ where: { id } });
    return result ? new Customer(result.id, result.name, result.email, result.cpf, result.phone) : null;
  }

  async findAll(): Promise<Customer[]> {
    const results = await this.prisma.customer.findMany();
    return results.map((result: Record<string, any>) => new Customer(result.id, result.name, result.email, result.cpf, result.phone));
  }

  async update(item: Customer): Promise<Customer> {
    const result = await this.prisma.customer.update({
      where: { id: item.id },
      data: {
        name: item.name,
        email: item.email,
        cpf: item.cpf,
        phone: item.phone,
      },
    });
    return new Customer(result.id, result.name, result.email, result.cpf, result.phone);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const result = await this.prisma.customer.findUnique({ where: { email } });
    return result ? new Customer(result.id, result.name, result.email, result.cpf, result.phone) : null;
  }

  async findByCPF(cpf: string): Promise<Customer | null> {
    const result = await this.prisma.customer.findUnique({ where: { cpf } });
    return result ? new Customer(result.id, result.name, result.email, result.cpf, result.phone) : null;
  }
}
