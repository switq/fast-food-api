import Product from "@entities/Product";
import { DbConnection } from "@src/interfaces/dbconnection";
import { ProductGatewayInterface } from "@interfaces/gateway";
import { DbParam } from "../types/DbParam";

export class ProductGateway implements ProductGatewayInterface {
  private readonly dataRepository: DbConnection;
  private readonly tableName = "products";

  constructor(connection: DbConnection) {
    this.dataRepository = connection;
  }

  public async findById(id: string): Promise<Product | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "id", value: id }]
    );
    if (!result || result.length < 1) return null;
    const row = result[0];
    return new Product(row.id, row.name, row.description, row.price, row.categoryId, row.imageUrl, row.isAvailable);
  }

  public async findByName(name: string): Promise<Product | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "name", value: name }]
    );
    if (!result || result.length < 1) return null;
    const row = result[0];
    return new Product(row.id, row.name, row.description, row.price, row.categoryId, row.imageUrl, row.isAvailable);
  }

  public async findByCategory(categoryId: string): Promise<Product[]> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "categoryId", value: categoryId }]
    );
    if (!result) return [];
    return result.map((row: any) => new Product(row.id, row.name, row.description, row.price, row.categoryId, row.imageUrl, row.isAvailable));
  }

  public async findAll(): Promise<Product[]> {
    const result = await this.dataRepository.findAll(this.tableName, null);
    if (!result) return [];
    return result.map((row: any) => new Product(row.id, row.name, row.description, row.price, row.categoryId, row.imageUrl, row.isAvailable));
  }

  public async create(product: Product): Promise<Product> {
    const params: DbParam[] = [
      { field: "id", value: product.id },
      { field: "name", value: product.name },
      { field: "description", value: product.description },
      { field: "price", value: product.price },
      { field: "categoryId", value: product.categoryId },
      { field: "imageUrl", value: product.imageUrl },
      { field: "isAvailable", value: product.isAvailable },
    ];
    await this.dataRepository.insert(this.tableName, params);
    return product;
  }

  public async update(product: Product): Promise<Product> {
    const params: DbParam[] = [
      { field: "name", value: product.name },
      { field: "description", value: product.description },
      { field: "price", value: product.price },
      { field: "categoryId", value: product.categoryId },
      { field: "imageUrl", value: product.imageUrl },
      { field: "isAvailable", value: product.isAvailable },
    ];
    await this.dataRepository.update(this.tableName, product.id, params);
    return product;
  }

  public async add(product: Product): Promise<Product> {
    return this.create(product);
  }

  public async delete(id: string): Promise<void> {
    await this.dataRepository.delete(this.tableName, id);
  }

  public async remove(id: string): Promise<void> {
    await this.delete(id);
  }
}
