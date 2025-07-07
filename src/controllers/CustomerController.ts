import { CustomerPresenter } from "../presenters/CustomerPresenter";
import CustomerUseCases from "../application/use-cases/CustomerUseCases";
import { DbConnection } from "@src/interfaces/dbconnection";
import { CustomerGateway } from "@gateways/CustomerGateway";

export class CustomerController {
  static async listAll(dbconnection: DbConnection): Promise<any> {
    const gateway = new CustomerGateway(dbconnection);
    const useCase = new CustomerUseCases();
    const output = await useCase.findAllCustomers(gateway);
    return CustomerPresenter.listToHttp(output);
  }

  static async getById(id: string, dbconnection: DbConnection): Promise<any> {
    const gateway = new CustomerGateway(dbconnection);
    const useCase = new CustomerUseCases();
    const output = await useCase.findCustomerById(id, gateway);
    return CustomerPresenter.toHttp(output);
  }

  static async create(
    name: string,
    email: string,
    cpf: string,
    phone: string,
    dbconnection: DbConnection
  ): Promise<any> {
    const gateway = new CustomerGateway(dbconnection);
    const useCase = new CustomerUseCases();
    const output = await useCase.createCustomer(name, email, cpf, phone, gateway);
    return CustomerPresenter.toHttp(output);
  }
}
