import { OrderPresenter } from "../presenters/OrderPresenter";
import OrderUseCases from "../application/use-cases/OrderUseCases";
import { DbConnection } from "@src/interfaces/dbconnection";
import { OrderGateway } from "@gateways/OrderGateway";
import { ProductGateway } from "@gateways/ProductGateway";
import { CustomerGateway } from "@gateways/CustomerGateway";

export class OrderController {
  static async listAll(dbconnection: DbConnection): Promise<any> {
    const gateway = new OrderGateway(dbconnection);
    const useCase = new OrderUseCases();
    const output = await useCase.findAllOrders(gateway);
    return OrderPresenter.listToHttp(output);
  }

  static async getById(id: string, dbconnection: DbConnection): Promise<any> {
    const gateway = new OrderGateway(dbconnection);
    const useCase = new OrderUseCases();
    const output = await useCase.findOrderById(id, gateway);
    return OrderPresenter.toHttp(output);
  }

  static async create(customerId: string, items: any[], dbconnection: DbConnection): Promise<any> {
    const orderGateway = new OrderGateway(dbconnection);
    const productGateway = new ProductGateway(dbconnection);
    const customerGateway = new CustomerGateway(dbconnection);
    const useCase = new OrderUseCases();
    const output = await useCase.createOrder(items, orderGateway, productGateway, customerId, customerGateway);
    return OrderPresenter.toHttp(output);
  }
}
