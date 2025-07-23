import { makeCategoryUseCases } from "@src/application/use-cases/CategoryUseCases/MakeCategoryUseCases";
import { makeCategoryRepository } from "@src/infrastructure/repositories/prisma/category/MakeCategoryRepository";
import { UuidServiceImpl } from "@src/infrastructure/services/UuidServicesImpl";

export const categoryUseCases = makeCategoryUseCases(
  makeCategoryRepository(),
  new UuidServiceImpl()
);