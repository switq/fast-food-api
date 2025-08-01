import { IDatabaseConnection } from "@interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import { ProductGateway } from "../gateways/ProductGateway";
import { CustomerGateway } from "../gateways/CustomerGateway";
import OrderUseCases from "@usecases/OrderUseCases";
import OrderPresenter from "@presenters/OrderPresenter";
import OrderItem from "@entities/OrderItem";
import { OrderStatus } from "@entities/Order";

class OrderController {
  static async createOrder(
    items: OrderItem[],
    dbConnection: IDatabaseConnection,
    customerId?: string
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const order = await OrderUseCases.createOrder(
      items,
      orderGateway,
      productGateway,
      customerId,
      customerGateway
    );
    return OrderPresenter.toJSON(order);
  }

  static async getOrderById(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.findOrderById(id, orderGateway);
    return OrderPresenter.toJSON(order);
  }

  static async getOrdersByCustomer(
    customerId: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const orders = await OrderUseCases.findOrdersByCustomer(
      customerId,
      orderGateway
    );
    return OrderPresenter.toJSONArray(orders);
  }

  static async getAllOrders(dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const orders = await OrderUseCases.findAllOrders(orderGateway);
    return OrderPresenter.toJSONArray(orders);
  }

  static async getOrdersByStatus(
    status: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const orders = await OrderUseCases.findOrdersByStatus(status, orderGateway);
    return OrderPresenter.toJSONArray(orders);
  }

  static async listSortedOrders(dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const orders = await OrderUseCases.listSortedOrders(orderGateway);
    return OrderPresenter.toJSONArray(orders);
  }

  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.updateOrderStatus(
      id,
      status,
      orderGateway
    );
    return OrderPresenter.toJSON(order);
  }

  static async addItemsToOrder(
    id: string,
    items: OrderItem[],
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const order = await OrderUseCases.addItemsToOrder(
      id,
      items,
      orderGateway,
      productGateway
    );
    return OrderPresenter.toJSON(order);
  }

  static async updateItemQuantity(
    orderId: string,
    itemId: string,
    quantity: number,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.updateItemQuantity(
      orderId,
      itemId,
      quantity,
      orderGateway
    );
    return OrderPresenter.toJSON(order);
  }

  static async deleteOrderById(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    await OrderUseCases.deleteOrder(id, orderGateway);
    return { message: "Order deleted successfully" };
  }

  static async confirmOrder(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.confirmOrder(id, orderGateway);
    return OrderPresenter.toJSON(order);
  }

  static async confirmPayment(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.confirmPayment(id, orderGateway);
    return OrderPresenter.toJSON(order);
  }

  static async startPreparingOrder(
    id: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.startPreparingOrder(id, orderGateway);
    return OrderPresenter.toJSON(order);
  }

  static async markOrderAsReady(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.markOrderAsReady(id, orderGateway);
    return OrderPresenter.toJSON(order);
  }

  static async markOrderAsDelivered(
    id: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.markOrderAsDelivered(id, orderGateway);
    return OrderPresenter.toJSON(order);
  }

  static async cancelOrder(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await OrderUseCases.cancelOrder(id, orderGateway);
    return OrderPresenter.toJSON(order);
  }
}

export default OrderController;
