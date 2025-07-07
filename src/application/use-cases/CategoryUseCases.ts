import Category from "../../domain/entities/Category";
import { ICategoryRepository } from "@src/domain/repositories/ICategoryRepository";

export class CategoryUseCases {
  private readonly repository: ICategoryRepository;

  constructor(repository: ICategoryRepository) {
    this.repository = repository;
  }

  async createCategory(
    name: string,
    description: string
  ): Promise<Category> {
    const existingCategory = await this.repository.findByName(name);
    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }

    const category = new Category(undefined, name, description);
    return this.repository.create(category);
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async findCategoryByName(name: string): Promise<Category> {
    const category = await this.repository.findByName(name);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async findAllCategories(): Promise<Category[]> {
    return this.repository.findAll();
  }

  async updateCategory(
    id: string,
    name: string | undefined,
    description: string | undefined
  ): Promise<Category> {
    const existingCategory = await this.repository.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Check if the new name conflicts with another category
    if (name !== undefined && name !== existingCategory.name) {
      const categoryWithSameName = await this.repository.findByName(name);
      if (categoryWithSameName) {
        throw new Error("A category with this name already exists");
      }
      existingCategory.name = name;
    }

    // Update description only if provided
    if (description !== undefined) {
      existingCategory.description = description;
    }

    return this.repository.update(existingCategory);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    await this.repository.delete(id);
  }
}

export default CategoryUseCases;
