import Product from "../../../domain/entities/Product";
import { IProductRepository } from "../../repositories/IProductRepository";
import { ICategoryRepository } from "../../repositories/ICategoryRepository";
import { UUIDService } from "../../../domain/services/UUIDService";

class ProductUseCases {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly uuidService: UUIDService
  ) {}

  async createProduct(
    name: string,
    description: string,
    price: number,
    categoryId: string,
    imageUrl: string | undefined,
    isAvailable: boolean = true
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findByName(name);
    if (existingProduct) {
      throw new Error("A product with this name already exists");
    }

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const product = Product.create(
      name,
      description,
      price,
      categoryId,
      imageUrl,
      isAvailable,
      this.uuidService
    );
    return this.productRepository.create(product);
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async findProductByName(name: string): Promise<Product> {
    const product = await this.productRepository.findByName(name);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async findProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async updateProduct(
    id: string,
    name: string | undefined,
    description: string | undefined,
    price: number | undefined,
    categoryId: string | undefined,
    imageUrl: string | undefined,
    isAvailable: boolean | undefined
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Check if the new name conflicts with another product
    if (name !== undefined && name !== existingProduct.name) {
      const productWithSameName = await this.productRepository.findByName(name);
      if (productWithSameName) {
        throw new Error("A product with this name already exists");
      }
      existingProduct.name = name;
    }

    // Update other fields if provided
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

    return this.productRepository.update(existingProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await this.productRepository.delete(id);
  }
}

export default ProductUseCases;
