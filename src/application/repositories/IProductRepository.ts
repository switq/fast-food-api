import Product from "@src/domain/entities/Product";
import { IGenericRepository } from "./IGenericRepository";

export interface IProductRepository extends IGenericRepository<Product> {
  findByName(name: string): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
}
