import { IDatabaseConnection } from "@interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import { ProductGateway } from "../gateways/ProductGateway";
import { CustomerGateway } from "../gateways/CustomerGateway";
import OrderUseCases from "@usecases/OrderUseCases";
import EnhancedOrderPresenter from "@presenters/EnhancedOrderPresenter";
import ProductInfoService from "../../application/services/ProductInfoService";
import CustomerInfoService from "../../application/services/CustomerInfoService";
import OrderItem from "@entities/OrderItem";
import { OrderStatus } from "@entities/Order";

class OrderController {  static async createOrder(
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
    // Get product and customer information for the created order
    const products = await ProductInfoService.getProductsFromOrder(order, productGateway);
    const customers = await CustomerInfoService.getCustomerFromOrder(order, customerGateway);
    return EnhancedOrderPresenter.toJSON(order, products, customers);
  }
  static async getOrderById(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { order, products } = await OrderUseCases.findOrderByIdWithProducts(
      id,
      orderGateway,
      productGateway
    );
    const customers = await CustomerInfoService.getCustomerFromOrder(order, customerGateway);
    return EnhancedOrderPresenter.toJSON(order, products, customers);
  }
  static async getOrdersByCustomer(
    customerId: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { orders, products } = await OrderUseCases.findOrdersByCustomerWithProducts(
      customerId,
      orderGateway,
      productGateway
    );
    const customers = await CustomerInfoService.getCustomersFromOrders(orders, customerGateway);
    return EnhancedOrderPresenter.toJSONArray(orders, products, customers);
  }

  static async getAllOrders(dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { orders, products } = await OrderUseCases.findAllOrdersWithProducts(
      orderGateway,
      productGateway
    );
    const customers = await CustomerInfoService.getCustomersFromOrders(orders, customerGateway);
    return EnhancedOrderPresenter.toJSONArray(orders, products, customers);
  }  static async getOrdersByStatus(
    status: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { orders, products } = await OrderUseCases.findOrdersByStatusWithProducts(
      status,
      orderGateway,
      productGateway
    );
    const customers = await CustomerInfoService.getCustomersFromOrders(orders, customerGateway);
    return EnhancedOrderPresenter.toJSONArray(orders, products, customers);
  }

  static async listSortedOrders(dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { orders, products } = await OrderUseCases.listSortedOrdersWithProducts(
      orderGateway,
      productGateway
    );
    const customers = await CustomerInfoService.getCustomersFromOrders(orders, customerGateway);
    return EnhancedOrderPresenter.toJSONArray(orders, products, customers);
  }  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { order, products } = await OrderUseCases.updateOrderStatusWithProducts(
      id,
      status,
      orderGateway,
      productGateway
    );
    const customers = await CustomerInfoService.getCustomerFromOrder(order, customerGateway);
    return EnhancedOrderPresenter.toJSON(order, products, customers);
  }
  static async addItemsToOrder(
    id: string,
    items: OrderItem[],
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { order, products } = await OrderUseCases.addItemsToOrderWithProducts(
      id,
      items,
      orderGateway,
      productGateway
    );
    const customers = await CustomerInfoService.getCustomerFromOrder(order, customerGateway);
    return EnhancedOrderPresenter.toJSON(order, products, customers);
  }

  static async updateItemQuantity(
    orderId: string,
    itemId: string,
    quantity: number,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { order, products } = await OrderUseCases.updateItemQuantityWithProducts(
      orderId,
      itemId,
      quantity,
      orderGateway,
      productGateway
    );
    return EnhancedOrderPresenter.toJSON(order, products);
  }

  static async deleteOrderById(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    await OrderUseCases.deleteOrder(id, orderGateway);
    return { message: "Order deleted successfully" };
  }
  static async confirmOrder(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { order, products } = await OrderUseCases.confirmOrderWithProducts(
      id,
      orderGateway,
      productGateway
    );
    return EnhancedOrderPresenter.toJSON(order, products);
  }

  static async confirmPayment(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { order, products } = await OrderUseCases.confirmPaymentWithProducts(
      id,
      orderGateway,
      productGateway
    );
    return EnhancedOrderPresenter.toJSON(order, products);
  }

  static async startPreparingOrder(
    id: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { order, products } = await OrderUseCases.startPreparingOrderWithProducts(
      id,
      orderGateway,
      productGateway
    );
    return EnhancedOrderPresenter.toJSON(order, products);
  }

  static async markOrderAsReady(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { order, products } = await OrderUseCases.markOrderAsReadyWithProducts(
      id,
      orderGateway,
      productGateway
    );
    return EnhancedOrderPresenter.toJSON(order, products);
  }

  static async markOrderAsDelivered(
    id: string,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { order, products } = await OrderUseCases.markOrderAsDeliveredWithProducts(
      id,
      orderGateway,
      productGateway
    );
    return EnhancedOrderPresenter.toJSON(order, products);
  }

  static async cancelOrder(id: string, dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { order, products } = await OrderUseCases.cancelOrderWithProducts(
      id,
      orderGateway,
      productGateway
    );
    return EnhancedOrderPresenter.toJSON(order, products);
  }
}

export default OrderController;
