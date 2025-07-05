
export class OrderPresenter {
  static toHttp(order: any) {
    return {
      id: order.id,
      customerId: order.customerId,
      status: order.status,
      items: order.items,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static listToHttp(orders: any[]) {
    return orders.map(OrderPresenter.toHttp);
  }

  static error(error: any) {
    return { error: error.message };
  }
}
