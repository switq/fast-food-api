import { PrismaClient } from "@prisma/client";
import { DbConnection } from "@interfaces/dbconnection";
import { DbParam } from "../../../types/DbParam";

export class DbConnectionPrisma implements DbConnection {
  private prisma: PrismaClient;

  private readonly modelMap: Record<string, keyof PrismaClient> = {
    products: "product",
    product: "product",
    categories: "category",
    category: "category",
    customers: "customer",
    customer: "customer",
    orders: "order",
    order: "order"

  };

  constructor() {
    this.prisma = new PrismaClient();
  }

  private getModel(tableName: string) {
    const model = (this.prisma as any)[this.modelMap[tableName]];
    if (!model) throw new Error(`Model ${tableName} not found in PrismaClient`);
    return model;
  }

  async findByParams(tableName: string, fields: string[] | null, params: DbParam[]): Promise<any> {
    const where: Record<string, any> = {};
    params.forEach((p) => (where[p.field] = p.value));
    const select = fields && fields.length > 0 ? Object.fromEntries(fields.map(f => [f, true])) : undefined;
    return await this.getModel(tableName).findMany({ where, select });
  }

  async findAll(tableName: string, fields?: string[] | null): Promise<any[]> {
    const select = fields && fields.length > 0 ? Object.fromEntries(fields.map(f => [f, true])) : undefined;
    return await this.getModel(tableName).findMany({ select });
  }

  async insert(tableName: string, params: DbParam[]): Promise<void> {
    const data = Object.fromEntries(params.map(p => [p.field, p.value]));
    await this.getModel(tableName).create({ data });
  }

  async update(tableName: string, id: string, params: DbParam[]): Promise<void> {
    const data = Object.fromEntries(params.map(p => [p.field, p.value]));
    await this.getModel(tableName).update({ where: { id }, data });
  }

  async delete(tableName: string, id: string): Promise<void> {
    await this.getModel(tableName).delete({ where: { id } });
  }

  async getLastId(tableName: string): Promise<number> {
    const last = await this.getModel(tableName).findFirst({ orderBy: { id: 'desc' } });
    return last && typeof last.id === 'number' ? last.id : 0;
  }
}
