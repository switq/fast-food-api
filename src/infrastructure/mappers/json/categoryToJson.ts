import Category from "@src/domain/entities/Category";

export function categoryToJSON(category: Category) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
