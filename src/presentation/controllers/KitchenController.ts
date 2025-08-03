import { IDatabaseConnection } from "@interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import { ProductGateway } from "../gateways/ProductGateway";
import KitchenUseCases from "../../application/use-cases/KitchenUseCases";
import EnhancedOrderPresenter from "../presenters/EnhancedOrderPresenter";
import ProductInfoService from "../../application/services/ProductInfoService";
import KitchenPresenter from "../presenters/KitchenPresenter";
import { OrderStatus } from "../../domain/entities/Order";

class KitchenController {  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const order = await KitchenUseCases.updateOrderStatus(
      id,
      status,
      orderGateway
    );
    // Get product information for the updated order
    const products = await ProductInfoService.getProductsFromOrder(order, productGateway);
    return EnhancedOrderPresenter.toJSON(order, products);
  }

  static async getPaymentConfirmedOrders(dbConnection: IDatabaseConnection) {
    const orderGateway = new OrderGateway(dbConnection);
    const productGateway = new ProductGateway(dbConnection);
    const { orders, products } =
      await KitchenUseCases.getPaymentConfirmedOrders(
        orderGateway,
        productGateway
      );
    return KitchenPresenter.toJSONArray(orders, products);
  }
}

export default KitchenController;
