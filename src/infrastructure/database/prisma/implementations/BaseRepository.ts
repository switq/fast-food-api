import { PrismaClient } from "@prisma/client";

type PrismaModelDelegate = {
  create: Function;
  findUnique: Function;
  findMany: Function;
  update: Function;
  delete: Function;
};

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  protected abstract mapToEntity(data: Record<string, any>): T;
  protected abstract mapToPrisma(entity: T): Record<string, any>;

  protected abstract getModelName(): keyof PrismaClient;

  private get model(): PrismaModelDelegate {
    // @ts-ignore
    return this.prisma[this.getModelName()];
  }

  async create(entity: T): Promise<T> {
    const prismaData = this.mapToPrisma(entity);
    const result = await this.model.create({
      data: prismaData,
    });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findUnique({
      where: { id },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findAll(): Promise<T[]> {
    const results = await this.model.findMany();
    return results.map((result: Record<string, any>) =>
      this.mapToEntity(result)
    );
  }

  async update(entity: T): Promise<T> {
    const prismaData = this.mapToPrisma(entity);
    const { id, ...updateData } = prismaData;
    const result = await this.model.update({
      where: { id },
      data: updateData,
    });
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({
      where: { id },
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
