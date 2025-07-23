import { makeOrderUseCases } from "@src/application/use-cases/OrderUseCases/MakeOrderUseCases";
import { makeOrderRepository } from "@src/infrastructure/repositories/prisma/order/MakeOrderRepository";
import { UuidServiceImpl } from "@src/infrastructure/services/UuidServicesImpl";

export const orderUseCases = makeOrderUseCases(
  makeOrderRepository(),
  new UuidServiceImpl()
);
