import { BaseRepository } from "./BaseRepository";
import { ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import Category from "../../../../domain/entities/Category";
import { PrismaClient } from "@prisma/client";

export class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  protected getModelName(): keyof PrismaClient {
    return "category";
  }

  protected mapToEntity(data: Record<string, any>): Category {
    return new Category(data.id, data.name, data.description);
  }

  protected mapToPrisma(entity: Category): Record<string, any> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  async findByName(name: string): Promise<Category | null> {
    const result = await this.prisma.category.findFirst({
      where: { name },
    });
    return result ? this.mapToEntity(result) : null;
  }
}