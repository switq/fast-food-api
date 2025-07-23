import {
  createCategory,
  findCategoryById,
  findCategoryByName,
  findAllCategories,
  updateCategory,
  deleteCategory,
  CategoryUseCaseDeps
} from "./CategoryUseCases";

export const makeCategoryUseCases = (
  repository: import("@src/application/repositories/ICategoryRepository").ICategoryRepository,
  uuidService: import("@src/domain/services/UUIDService").UUIDService
) => {
  const deps: CategoryUseCaseDeps = { repository, uuidService };
  return {
    createCategory: createCategory(deps),
    findCategoryById: findCategoryById(deps),
    findCategoryByName: findCategoryByName(deps),
    findAllCategories: findAllCategories(deps),
    updateCategory: updateCategory(deps),
    deleteCategory: deleteCategory(deps),
  };
};
