import Category from "@entities/Category";
import { DbConnection } from "@src/interfaces/dbconnection";
import { CategoryGatewayInterface } from "@interfaces/gateway";
import { DbParam } from "../types/DbParam";

export class CategoryGateway implements CategoryGatewayInterface {
  private readonly dataRepository: DbConnection;
  private readonly tableName = "categories";

  constructor(connection: DbConnection) {
    this.dataRepository = connection;
  }

  public async findById(id: string): Promise<Category | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "id", value: id }]
    );
    if (!result || result.length < 1) return null;
    return new Category(result[0].id, result[0].name, result[0].description);
  }

  public async findByName(name: string): Promise<Category | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "name", value: name }]
    );
    if (!result || result.length < 1) return null;
    return new Category(result[0].id, result[0].name, result[0].description);
  }

  public async findAll(): Promise<Category[]> {
    const result = await this.dataRepository.findAll(this.tableName, null);
    if (!result) return [];
    return result.map((row: any) => new Category(row.id, row.name, row.description));
  }

  public async create(category: Category): Promise<Category> {
    const params: DbParam[] = [
      { field: "id", value: category.id },
      { field: "name", value: category.name },
      { field: "description", value: category.description },
    ];
    await this.dataRepository.insert(this.tableName, params);
    return category;
  }

  public async update(category: Category): Promise<Category> {
    const params: DbParam[] = [
      { field: "name", value: category.name },
      { field: "description", value: category.description },
    ];
    await this.dataRepository.update(this.tableName, category.id, params);
    return category;
  }

  public async add(category: Category): Promise<Category> {
    return this.create(category);
  }

  public async delete(id: string): Promise<void> {
    await this.dataRepository.delete(this.tableName, id);
  }

  public async remove(id: string): Promise<void> {
    await this.delete(id);
  }
}
