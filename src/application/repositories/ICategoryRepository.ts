import Category from "@src/domain/entities/Category";
import { IGenericRepository } from "./IGenericRepository";

export interface ICategoryRepository extends IGenericRepository<Category> {
  findByName(name: string): Promise<Category | null>;
}
