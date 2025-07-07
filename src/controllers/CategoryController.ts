import { CategoryPresenter } from "../presenters/CategoryPresenter";
import { CategoryUseCases } from "../application/use-cases/CategoryUseCases";
import { DbConnection } from "@src/interfaces/dbconnection";
import { CategoryGateway } from "@gateways/CategoryGateway";

export class CategoryController {
  static async listAll(dbconnection: DbConnection): Promise<any> {
    const gateway = new CategoryGateway(dbconnection);
    const useCase = new CategoryUseCases(gateway);
    const output = await useCase.findAllCategories();
    const presenter = new CategoryPresenter();
    return presenter.listToHttp(output);
  }

  static async getById(id: string, dbconnection: DbConnection): Promise<any> {
    const gateway = new CategoryGateway(dbconnection);
    const useCase = new CategoryUseCases(gateway);
    const output = await useCase.findCategoryById(id);
    const presenter = new CategoryPresenter();
    return presenter.toHttp(output);
  }

  static async create(name: string, description: string, dbconnection: DbConnection): Promise<any> {
    const gateway = new CategoryGateway(dbconnection);
    const useCase = new CategoryUseCases(gateway);
    const output = await useCase.createCategory(name, description);
    const presenter = new CategoryPresenter();
    return presenter.toHttp(output);
  }
}
