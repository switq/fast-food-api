import { PrismaClient } from "@prisma/client";
import { OrderRepository } from "./OrderRepository";

export function makeOrderRepository(prisma?: PrismaClient) {
  const prismaClient = prisma ?? new PrismaClient();
  return new OrderRepository(prismaClient);
}
