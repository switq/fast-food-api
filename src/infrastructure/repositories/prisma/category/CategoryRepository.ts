import { PrismaClient } from "@prisma/client";
import { ICategoryRepository } from "@src/application/repositories/ICategoryRepository";
import Category from "@src/domain/entities/Category";

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(item: Category): Promise<Category> {
    const result = await this.prisma.category.create({ data: { id: item.id, name: item.name, description: item.description } });
    return new Category(result.id, result.name, result.description);
  }

  async findById(id: string): Promise<Category | null> {
    const result = await this.prisma.category.findUnique({ where: { id } });
    return result ? new Category(result.id, result.name, result.description) : null;
  }

  async findAll(): Promise<Category[]> {
    const results = await this.prisma.category.findMany();
    return results.map((result: Record<string, any>) => new Category(result.id, result.name, result.description));
  }

  async update(item: Category): Promise<Category> {
    const result = await this.prisma.category.update({
      where: { id: item.id },
      data: { name: item.name, description: item.description },
    });
    return new Category(result.id, result.name, result.description);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  async findByName(name: string): Promise<Category | null> {
    const result = await this.prisma.category.findFirst({ where: { name } });
    return result ? new Category(result.id, result.name, result.description) : null;
  }
}
