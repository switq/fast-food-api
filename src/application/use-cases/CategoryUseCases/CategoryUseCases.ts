
import Category from "@src/domain/entities/Category";
import { UUIDService } from "@src/domain/services/UUIDService";
import { ICategoryRepository } from "@src/application/repositories/ICategoryRepository";

// Dependency object for all use cases
export type CategoryUseCaseDeps = {
  repository: ICategoryRepository;
  uuidService: UUIDService;
};

// Input/output types for each use case
export type CreateCategoryInput = { name: string; description: string };
export type FindCategoryByIdInput = { id: string };
export type FindCategoryByNameInput = { name: string };
export type UpdateCategoryInput = { id: string; name?: string; description?: string };
export type DeleteCategoryInput = { id: string };

export const createCategory = ({ repository, uuidService }: CategoryUseCaseDeps) =>
  async ({ name, description }: CreateCategoryInput): Promise<Category> => {
    const existingCategory = await repository.findByName(name);
    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }
    const category = Category.create(name, description, uuidService);
    return repository.create(category);
  };

export const findCategoryById = ({ repository }: CategoryUseCaseDeps) =>
  async ({ id }: FindCategoryByIdInput): Promise<Category> => {
    const category = await repository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  };

export const findCategoryByName = ({ repository }: CategoryUseCaseDeps) =>
  async ({ name }: FindCategoryByNameInput): Promise<Category> => {
    const category = await repository.findByName(name);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  };

export const findAllCategories = ({ repository }: CategoryUseCaseDeps) =>
  async (): Promise<Category[]> => {
    return repository.findAll();
  };

export const updateCategory = ({ repository }: CategoryUseCaseDeps) =>
  async ({ id, name, description }: UpdateCategoryInput): Promise<Category> => {
    const existingCategory = await repository.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }
    if (name !== undefined && name !== existingCategory.name) {
      const categoryWithSameName = await repository.findByName(name);
      if (categoryWithSameName) {
        throw new Error("A category with this name already exists");
      }
      existingCategory.name = name;
    }
    if (description !== undefined) {
      existingCategory.description = description;
    }
    return repository.update(existingCategory);
  };

export const deleteCategory = ({ repository }: CategoryUseCaseDeps) =>
  async ({ id }: DeleteCategoryInput): Promise<void> => {
    const category = await repository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await repository.delete(id);
  };
