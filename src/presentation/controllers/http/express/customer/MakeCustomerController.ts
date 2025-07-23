import { makeCustomerUseCases } from "@src/application/use-cases/CustomerUseCases/MakeCustomerUseCases";
import { makeCustomerRepository } from "@src/infrastructure/repositories/prisma/customer/MakeCustomerRepository";
import { UuidServiceImpl } from "@src/infrastructure/services/UuidServicesImpl";

export const customerUseCases = makeCustomerUseCases(
  makeCustomerRepository(),
  new UuidServiceImpl()
);