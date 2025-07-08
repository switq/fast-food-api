import OrderItem from "../../domain/entities/OrderItem";

export interface IOrderItemRepository {
  create(orderItem: OrderItem): Promise<OrderItem>;
  findById(id: string): Promise<OrderItem | null>;
  findByOrderId(orderId: string): Promise<OrderItem[]>;
  findAll(): Promise<OrderItem[]>;
  update(orderItem: OrderItem): Promise<OrderItem>;
  delete(id: string): Promise<void>;
}
