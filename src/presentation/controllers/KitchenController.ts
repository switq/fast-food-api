import { IDatabaseConnection } from "@src/interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import { ProductGateway } from "../gateways/ProductGateway";
import KitchenUseCases from "../../application/use-cases/KitchenUseCases";
import OrderPresenter from "../presenters/OrderPresenter";
import KitchenPresenter from "../presenters/KitchenPresenter";
import { OrderStatus } from "../../domain/entities/Order";

class KitchenController {
  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    dbConnection: IDatabaseConnection
  ) {
    const orderGateway = new OrderGateway(dbConnection);
    const order = await KitchenUseCases.updateOrderStatus(
      id,
      status,
      orderGateway
    );
    return OrderPresenter.toJSON(order);
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
