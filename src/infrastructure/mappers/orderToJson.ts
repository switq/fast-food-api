import Order from "../../domain/entities/Order";
import { orderItemToJSON } from "./orderItemToJson";

export function orderToJSON(order: Order) {
  return {
    id: order.id,
    customerId: order.customerId,
    items: order.items.map(orderItemToJSON),
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
