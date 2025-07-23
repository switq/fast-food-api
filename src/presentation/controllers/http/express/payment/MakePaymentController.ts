import { makePaymentUseCases } from "@src/application/use-cases/PaymentUseCases/MakePaymentUseCase";
import { makePaymentRepository } from "@src/infrastructure/repositories/prisma/payment/MakePaymentRepository";
import { UuidServiceImpl } from "@src/infrastructure/services/UuidServicesImpl";

export const paymentUseCases = makePaymentUseCases(
  makePaymentRepository(),
  new UuidServiceImpl()
);
