import { PrismaClient } from "@prisma/client";
import { PaymentRepository } from "./PaymentRepository";

export function makePaymentRepository(prisma?: PrismaClient) {
  const prismaClient = prisma ?? new PrismaClient();
  return new PaymentRepository(prismaClient);
}
