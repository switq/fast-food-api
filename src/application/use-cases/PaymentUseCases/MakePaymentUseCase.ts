import { IPaymentRepository } from '../../repositories/IPaymentRepository';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { UUIDService } from '../../../domain/services/UUIDService';
import PaymentUseCase from './PaymentUseCase';

export const makePaymentUseCase = (
  paymentRepository: IPaymentRepository,
  orderRepository: IOrderRepository,
  uuidService: UUIDService
): PaymentUseCase => new PaymentUseCase(paymentRepository, orderRepository, uuidService);
