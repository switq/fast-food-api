
import { UUIDService } from "../../../domain/services/UUIDService";
import { ICategoryRepository } from "../../repositories/ICategoryRepository";
import CategoryUseCases from "./CategoryUseCases";

export const makeCategoryUseCases = (
  repository: ICategoryRepository,
  uuidService: UUIDService
): CategoryUseCases => new CategoryUseCases(repository, uuidService);
