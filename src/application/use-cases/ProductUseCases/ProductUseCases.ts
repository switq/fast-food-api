
import Product from "@src/domain/entities/Product";
import { IProductRepository } from "@src/application/repositories/IProductRepository";
import { ICategoryRepository } from "@src/application/repositories/ICategoryRepository";
import { UUIDService } from "@src/domain/services/UUIDService";

export type ProductUseCaseDeps = {
  productRepository: IProductRepository;
  categoryRepository: ICategoryRepository;
  uuidService: UUIDService;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable?: boolean;
};
export type FindProductByIdInput = { id: string };
export type FindProductByNameInput = { name: string };
export type FindProductsByCategoryInput = { categoryId: string };
export type UpdateProductInput = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
  isAvailable?: boolean;
};
export type DeleteProductInput = { id: string };

export const createProduct = ({ productRepository, categoryRepository, uuidService }: ProductUseCaseDeps) =>
  async ({ name, description, price, categoryId, imageUrl, isAvailable = true }: CreateProductInput): Promise<Product> => {
    const existingProduct = await productRepository.findByName(name);
    if (existingProduct) {
      throw new Error("A product with this name already exists");
    }
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    const product = Product.create(name, description, price, categoryId, imageUrl, isAvailable, uuidService);
    return productRepository.create(product);
  };

export const findProductById = ({ productRepository }: ProductUseCaseDeps) =>
  async ({ id }: FindProductByIdInput): Promise<Product> => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  };

export const findProductByName = ({ productRepository }: ProductUseCaseDeps) =>
  async ({ name }: FindProductByNameInput): Promise<Product> => {
    const product = await productRepository.findByName(name);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  };

export const findProductsByCategory = ({ productRepository }: ProductUseCaseDeps) =>
  async ({ categoryId }: FindProductsByCategoryInput): Promise<Product[]> => {
    return productRepository.findByCategory(categoryId);
  };

export const findAllProducts = ({ productRepository }: ProductUseCaseDeps) =>
  async (): Promise<Product[]> => {
    return productRepository.findAll();
  };

export const updateProduct = ({ productRepository }: ProductUseCaseDeps) =>
  async ({ id, name, description, price, categoryId, imageUrl, isAvailable }: UpdateProductInput): Promise<Product> => {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    if (name !== undefined && name !== existingProduct.name) {
      const productWithSameName = await productRepository.findByName(name);
      if (productWithSameName) {
        throw new Error("A product with this name already exists");
      }
      existingProduct.name = name;
    }
    if (description !== undefined) {
      existingProduct.description = description;
    }
    if (price !== undefined) {
      existingProduct.price = price;
    }
    if (categoryId !== undefined) {
      existingProduct.categoryId = categoryId;
    }
    if (imageUrl !== undefined) {
      existingProduct.imageUrl = imageUrl;
    }
    if (isAvailable !== undefined) {
      existingProduct.isAvailable = isAvailable;
    }
    return productRepository.update(existingProduct);
  };

export const deleteProduct = ({ productRepository }: ProductUseCaseDeps) =>
  async ({ id }: DeleteProductInput): Promise<void> => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await productRepository.delete(id);
  };
