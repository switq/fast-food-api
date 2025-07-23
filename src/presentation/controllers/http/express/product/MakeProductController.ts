import { makeProductUseCases } from "@src/application/use-cases/ProductUseCases/MakeProductUseCases";
import { makeProductRepository } from "@src/infrastructure/repositories/prisma/product/MakeProductRepository";
import { UuidServiceImpl } from "@src/infrastructure/services/UuidServicesImpl";

export const productUseCases = makeProductUseCases(
  makeProductRepository(),
  new UuidServiceImpl()
);
