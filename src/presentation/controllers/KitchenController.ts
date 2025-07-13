import { IDatabaseConnection } from "@src/interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import KitchenUseCases from "../../application/use-cases/KitchenUseCases";
import OrderPresenter from "../presenters/OrderPresenter";
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
}

export default KitchenController;
