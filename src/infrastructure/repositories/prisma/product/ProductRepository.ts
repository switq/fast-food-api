import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "../../../../application/repositories/IProductRepository";
import Product from "../../../../domain/entities/Product";

export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(item: Product): Promise<Product> {
    const result = await this.prisma.product.create({
      data: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
      },
    });
    return new Product(result.id, result.name, result.description, result.price, result.categoryId, result.imageUrl, result.isAvailable);
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.prisma.product.findUnique({ where: { id } });
    return result ? new Product(result.id, result.name, result.description, result.price, result.categoryId, result.imageUrl, result.isAvailable) : null;
  }

  async findAll(): Promise<Product[]> {
    const results = await this.prisma.product.findMany();
    return results.map((result: Record<string, any>) => new Product(result.id, result.name, result.description, result.price, result.categoryId, result.imageUrl, result.isAvailable));
  }

  async update(item: Product): Promise<Product> {
    const result = await this.prisma.product.update({
      where: { id: item.id },
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
      },
    });
    return new Product(result.id, result.name, result.description, result.price, result.categoryId, result.imageUrl, result.isAvailable);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async findByName(name: string): Promise<Product | null> {
    const result = await this.prisma.product.findFirst({ where: { name } });
    return result ? new Product(result.id, result.name, result.description, result.price, result.categoryId, result.imageUrl, result.isAvailable) : null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const results = await this.prisma.product.findMany({ where: { categoryId } });
    return results.map((result: Record<string, any>) => new Product(result.id, result.name, result.description, result.price, result.categoryId, result.imageUrl, result.isAvailable));
  }
}
