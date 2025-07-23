import { PrismaClient } from "@prisma/client";
import { CategoryRepository } from "./CategoryRepository";

export function makeCategoryRepository(prisma?: PrismaClient) {
  const prismaClient = prisma ?? new PrismaClient();
  return new CategoryRepository(prismaClient);
}
