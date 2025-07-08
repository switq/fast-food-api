import Product from "../../domain/entities/Product";

export function productToJSON(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
