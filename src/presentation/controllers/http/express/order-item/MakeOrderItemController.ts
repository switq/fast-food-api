import { makeOrderItemUseCases } from "@src/application/use-cases/OrderItemUseCases/MakeOrdemItemUseCases";
import { makeOrderItemRepository } from "@src/infrastructure/repositories/prisma/order-item/MakeOrderItemRepository";
import { UuidServiceImpl } from "@src/infrastructure/services/UuidServicesImpl";

export const orderItemUseCases = makeOrderItemUseCases(
  makeOrderItemRepository(),
  new UuidServiceImpl()
);
