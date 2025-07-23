import { PrismaClient } from "@prisma/client";
import { ProductRepository } from "./ProductRepository";

export function makeProductRepository(prisma?: PrismaClient) {
  const prismaClient = prisma ?? new PrismaClient();
  return new ProductRepository(prismaClient);
}
