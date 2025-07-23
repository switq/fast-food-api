import OrderItem from "@src/domain/entities/OrderItem";
import { IGenericRepository } from "./IGenericRepository";

export interface IOrderItemRepository extends IGenericRepository<OrderItem> {
  findByOrderId(orderId: string): Promise<OrderItem[]>;
  findByProductId(productId: string): Promise<OrderItem[]>;
}
