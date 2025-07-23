
import {
  createProduct,
  findProductById,
  findProductByName,
  findProductsByCategory,
  findAllProducts,
  updateProduct,
  deleteProduct,
  ProductUseCaseDeps
} from "./ProductUseCases";

import { IProductRepository } from "@src/application/repositories/IProductRepository";
import { ICategoryRepository } from "@src/application/repositories/ICategoryRepository";
import { UUIDService } from "@src/domain/services/UUIDService";

export const makeProductUseCases = (
  productRepository: IProductRepository,
  categoryRepository: ICategoryRepository,
  uuidService: UUIDService
) => {
  const deps: ProductUseCaseDeps = { productRepository, categoryRepository, uuidService };
  return {
    createProduct: createProduct(deps),
    findProductById: findProductById(deps),
    findProductByName: findProductByName(deps),
    findProductsByCategory: findProductsByCategory(deps),
    findAllProducts: findAllProducts(deps),
    updateProduct: updateProduct(deps),
    deleteProduct: deleteProduct(deps),
  };
};
