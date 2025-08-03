import { IDatabaseConnection } from "@interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import { ProductGateway } from "../gateways/ProductGateway";
import { CustomerGateway } from "../gateways/CustomerGateway";
import KitchenUseCases from "../../application/use-cases/KitchenUseCases";
import EnhancedOrderPresenter from "../presenters/EnhancedOrderPresenter";
import ProductInfoService from "../../application/services/ProductInfoService";
import CustomerInfoService from "../../application/services/CustomerInfoService";
import KitchenPresenter from "../presenters/KitchenPresenter";
import { OrderStatus } from "../../domain/entities/Order";

class KitchenController {
  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const order = await KitchenUseCases.updateOrderStatus(
      id,
      status,
      orderGateway
    );
    // Get product and customer information for the updated order
    const products = await ProductInfoService.getProductsFromOrder(order, productGateway);
    const customers = await CustomerInfoService.getCustomerFromOrder(order, customerGateway);
    return EnhancedOrderPresenter.toJSON(order, products, customers);
  }

  static async getPaymentConfirmedOrders(dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const customerGateway = new CustomerGateway(dbConnection);
    const { orders, products } =
      await KitchenUseCases.getPaymentConfirmedOrders(
        orderGateway,
        productGateway
      );
    const customers = await CustomerInfoService.getCustomersFromOrders(orders, customerGateway);
    return KitchenPresenter.toJSONArray(orders, products, customers);
  }
}

export default KitchenController;
