import Order from "../../domain/entities/Order";
import Product from "../../domain/entities/Product";

interface EnhancedOrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observation?: string;
}

interface EnhancedOrder {
  id: string;
  customerId?: string;
  items: EnhancedOrderItem[];
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  paymentProviderId?: string;
  orderNumber?: number;
}

class EnhancedOrderPresenter {
  static toJSON(order: Order, products: Map<string, Product>): EnhancedOrder {
    const items = order.items.map((item) => {
      const product = products.get(item.productId);
      return {
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: product?.name || "Produto não encontrado",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        observation: item.observation,
      };
    });

    return {
      id: order.id,
      customerId: order.customerId,
      items,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paymentProviderId: order.paymentProviderId,
      orderNumber: order.orderNumber,
    };
  }

  static toJSONArray(
    orders: Order[],
    products: Map<string, Product>
  ): EnhancedOrder[] {
    return orders.map((order) => this.toJSON(order, products));
  }
}

export default EnhancedOrderPresenter;
