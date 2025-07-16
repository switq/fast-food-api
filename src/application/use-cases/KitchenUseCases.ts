import Order, { OrderStatus } from "../../domain/entities/Order";
import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";

class KitchenUseCases {
  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    switch (status) {
      case OrderStatus.PREPARING:
        if (order.status !== OrderStatus.PAYMENT_CONFIRMED) {
          throw new Error(
            "Order can only be moved to PREPARING from PAYMENT_CONFIRMED"
          );
        }
        order.startPreparing();
        break;
      case OrderStatus.READY:
        if (order.status !== OrderStatus.PREPARING) {
          throw new Error("Order can only be moved to READY from PREPARING");
        }
        order.markAsReady();
        break;
      default:
        throw new Error(`Invalid status transition for kitchen: ${status}`);
    }

    return repository.update(order);
  }
}

export default KitchenUseCases;
