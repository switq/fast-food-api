import Order from "@src/domain/entities/Order";
import { IGenericRepository } from "./IGenericRepository";

export interface IOrderRepository extends IGenericRepository<Order> {
  findByCustomerId(customerId: string): Promise<Order[]>;
}
