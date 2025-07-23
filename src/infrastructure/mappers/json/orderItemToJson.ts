import OrderItem from "@src/domain/entities/OrderItem";

export function orderItemToJSON(orderItem: OrderItem) {
  return {
    id: orderItem.id,
    orderId: orderItem.orderId,
    productId: orderItem.productId,
    quantity: orderItem.quantity,
    unitPrice: orderItem.unitPrice,
    totalPrice: orderItem.totalPrice,
    observation: orderItem.observation,
    createdAt: orderItem.createdAt,
    updatedAt: orderItem.updatedAt,
  };
}
