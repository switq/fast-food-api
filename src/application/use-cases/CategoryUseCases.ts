import Category from "../../domain/entities/Category";
import { ICategoryRepository } from "../repositories/ICategoryRepository";

export class CategoryUseCases {
  async createCategory(
    name: string,
    description: string,
    repository: ICategoryRepository
  ): Promise<Category> {
    const existingCategory = await repository.findByName(name);
    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }
    const category = new Category(undefined, name, description);
    return repository.create(category);
  }

  async findCategoryById(
    id: string,
    repository: ICategoryRepository
  ): Promise<Category> {
    const category = await repository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async findCategoryByName(
    name: string,
    repository: ICategoryRepository
  ): Promise<Category> {
    const category = await repository.findByName(name);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async findAllCategories(
    repository: ICategoryRepository
  ): Promise<Category[]> {
    return repository.findAll();
  }

  async updateCategory(
    id: string,
    name: string | undefined,
    description: string | undefined,
    repository: ICategoryRepository
  ): Promise<Category> {
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
  }

  async deleteCategory(
    id: string,
    repository: ICategoryRepository
  ): Promise<void> {
    const category = await repository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await repository.delete(id);
  }
}

export default CategoryUseCases;
