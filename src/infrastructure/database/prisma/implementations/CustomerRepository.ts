import { BaseRepository } from "./BaseRepository";
import { ICustomerRepository } from "../../../../domain/repositories/ICustomerRepository";
import Customer from "../../../../domain/entities/Customer";
import { PrismaClient } from "@prisma/client";

export class CustomerRepository
  extends BaseRepository<Customer>
  implements ICustomerRepository
{
  protected getModelName(): keyof PrismaClient {
    return "customer";
  }

  protected mapToEntity(data: Record<string, any>): Customer {
    return new Customer(data.id, data.name, data.email, data.cpf, data.phone);
  }

  protected mapToPrisma(entity: Customer): Record<string, any> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      cpf: entity.cpf,
      phone: entity.phone,
    };
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const result = await this.prisma.customer.findUnique({
      where: { email },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByCPF(cpf: string): Promise<Customer | null> {
    const result = await this.prisma.customer.findUnique({
      where: { cpf },
    });
    return result ? this.mapToEntity(result) : null;
  }
}
