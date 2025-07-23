import { PrismaClient } from "@prisma/client";
import { CustomerRepository } from "./CustomerRepository";

export function makeCustomerRepository(prisma?: PrismaClient) {
  const prismaClient = prisma ?? new PrismaClient();
  return new CustomerRepository(prismaClient);
}
