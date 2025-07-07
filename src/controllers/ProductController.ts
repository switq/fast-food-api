import { ProductPresenter } from "../presenters/ProductPresenter";
import ProductUseCases from "../application/use-cases/ProductUseCases";
import { DbConnection } from "@src/interfaces/dbconnection";
import { ProductGateway } from "@gateways/ProductGateway";

export class ProductController {
  static async listAll(dbconnection: DbConnection): Promise<any> {
    const gateway = new ProductGateway(dbconnection);
    const useCase = new ProductUseCases();
    const output = await useCase.findAllProducts(gateway);
    return ProductPresenter.listToHttp(output);
  }

  static async getById(id: string, dbconnection: DbConnection): Promise<any> {
    const gateway = new ProductGateway(dbconnection);
    const useCase = new ProductUseCases();
    const output = await useCase.findProductById(id, gateway);
    return ProductPresenter.toHttp(output);
  }

  static async create(
    name: string,
    description: string,
    price: number,
    categoryId: string,
    imageUrl: string,
    dbconnection: DbConnection
  ): Promise<any> {
    const productGateway = new ProductGateway(dbconnection);
    const categoryGateway = new (await import("@gateways/CategoryGateway")).CategoryGateway(dbconnection);
    const useCase = new ProductUseCases();
    const output = await useCase.createProduct(
      name,
      description,
      price,
      categoryId,
      imageUrl,
      productGateway,
      categoryGateway
    );
    return ProductPresenter.toHttp(output);
  }

  static async update(
    id: string,
    name: string | undefined,
    description: string | undefined,
    price: number | undefined,
    categoryId: string | undefined,
    imageUrl: string | undefined,
    isAvailable: boolean | undefined,
    dbconnection: DbConnection
  ): Promise<any> {
    const gateway = new ProductGateway(dbconnection);
    const useCase = new ProductUseCases();
    const output = await useCase.updateProduct(
      id,
      name,
      description,
      price,
      categoryId,
      imageUrl,
      isAvailable,
      gateway
    );
    return ProductPresenter.toHttp(output);
  }

  static async remove(id: string, dbconnection: DbConnection): Promise<void> {
    const gateway = new ProductGateway(dbconnection);
    const useCase = new ProductUseCases();
    await useCase.deleteProduct(id, gateway);
  }
}
