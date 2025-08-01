import Order, { OrderStatus } from "../../domain/entities/Order";
import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";
import { IProductRepository } from "../../interfaces/repositories/IProductRepository";
import Product from "../../domain/entities/Product";

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

  static async getPaymentConfirmedOrders(
    orderRepository: IOrderRepository,
    productRepository: IProductRepository
  ): Promise<{ orders: Order[]; products: Map<string, Product> }> {
    const orders = await orderRepository.findByStatus(
      OrderStatus.PAYMENT_CONFIRMED
    );

    // Buscar todos os produtos únicos dos pedidos
    const productIds = new Set<string>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productIds.add(item.productId);
      });
    });

    // Buscar informações dos produtos
    const products = new Map<string, Product>();
    for (const productId of productIds) {
      const product = await productRepository.findById(productId);
      if (product) {
        products.set(productId, product);
      }
    }

    return { orders, products };
  }
}

export default KitchenUseCases;
