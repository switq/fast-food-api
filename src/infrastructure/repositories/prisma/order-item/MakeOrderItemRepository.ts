import { PrismaClient } from "@prisma/client";
import { OrderItemRepository } from "./OrderItemRepository";

export function makeOrderItemRepository(prisma?: PrismaClient) {
  const prismaClient = prisma ?? new PrismaClient();
  return new OrderItemRepository(prismaClient);
}
