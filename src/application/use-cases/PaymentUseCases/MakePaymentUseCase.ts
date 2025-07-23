
import {
  createPayment,
  findPaymentById,
  findPaymentsByOrderId,
  findAllPayments,
  updatePayment,
  deletePayment,
  PaymentUseCaseDeps
} from "./PaymentUseCase";

import { IPaymentRepository } from '@src/application/repositories/IPaymentRepository';
import { IOrderRepository } from '@src/application/repositories/IOrderRepository';
import { UUIDService } from '@src/domain/services/UUIDService';

export const makePaymentUseCase = (
  paymentRepository: IPaymentRepository,
  orderRepository: IOrderRepository,
  uuidService: UUIDService
) => {
  const deps: PaymentUseCaseDeps = { paymentRepository, orderRepository, uuidService };
  return {
    createPayment: createPayment(deps),
    findPaymentById: findPaymentById(deps),
    findPaymentsByOrderId: findPaymentsByOrderId(deps),
    findAllPayments: findAllPayments(deps),
    updatePayment: updatePayment(deps),
    deletePayment: deletePayment(deps),
  };
};
