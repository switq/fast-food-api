import { IProductRepository } from "../../repositories/IProductRepository";
import { ICategoryRepository } from "../../repositories/ICategoryRepository";
import { UUIDService } from "../../../domain/services/UUIDService";
import ProductUseCases from "./ProductUseCases";

export const makeProductUseCases = (
  productRepository: IProductRepository,
  categoryRepository: ICategoryRepository,
  uuidService: UUIDService
): ProductUseCases => new ProductUseCases(productRepository, categoryRepository, uuidService);
