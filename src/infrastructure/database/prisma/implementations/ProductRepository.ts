import { BaseRepository } from "./BaseRepository";
import { IProductRepository } from "../../../../application/repositories/IProductRepository";
import Product from "../../../../domain/entities/Product";
import { PrismaClient } from "@prisma/client";

export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  protected getModelName(): keyof PrismaClient {
    return "product";
  }

  protected mapToEntity(data: Record<string, any>): Product {
    return new Product(
      data.id,
      data.name,
      data.description,
      data.price,
      data.categoryId,
      data.imageUrl,
      data.isAvailable
    );
  }

  protected mapToPrisma(entity: Product): Record<string, any> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      categoryId: entity.categoryId,
      imageUrl: entity.imageUrl,
      isAvailable: entity.isAvailable,
    };
  }

  async findByName(name: string): Promise<Product | null> {
    const result = await this.prisma.product.findFirst({
      where: { name },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: { categoryId },
    });
    return results.map((result: Record<string, any>) =>
      this.mapToEntity(result)
    );
  }
}
