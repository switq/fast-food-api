import Customer from "@src/domain/entities/Customer";
import { IGenericRepository } from "./IGenericRepository";

export interface ICustomerRepository extends IGenericRepository<Customer> {
  findByEmail(email: string): Promise<Customer | null>;
  findByCPF(cpf: string): Promise<Customer | null>;
}
