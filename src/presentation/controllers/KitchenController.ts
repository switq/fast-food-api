import { IDatabaseConnection } from "@interfaces/IDbConnection";
import { OrderGateway } from "../gateways/OrderGateway";
import KitchenUseCases from "@usecases/KitchenUseCases";
import OrderPresenter from "@presenters/OrderPresenter";
import { OrderStatus } from "@entities/Order";

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
