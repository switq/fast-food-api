
import Payment, { PaymentStatus } from '@src/domain/entities/Payment';
import { IPaymentRepository } from '@src/application/repositories/IPaymentRepository';
import { IOrderRepository } from '@src/application/repositories/IOrderRepository';
import { UUIDService } from '@src/domain/services/UUIDService';

export type PaymentUseCaseDeps = {
  paymentRepository: IPaymentRepository;
  orderRepository: IOrderRepository;
  uuidService: UUIDService;
};

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paidAt: Date;
};
export type FindPaymentByIdInput = { id: string };
export type FindPaymentsByOrderIdInput = { orderId: string };
export type UpdatePaymentInput = {
  id: string;
  amount?: number;
  paymentStatus?: PaymentStatus;
  paidAt?: Date;
};
export type DeletePaymentInput = { id: string };

export const createPayment = ({ paymentRepository, orderRepository, uuidService }: PaymentUseCaseDeps) =>
  async ({ orderId, amount, paymentStatus, paidAt }: CreatePaymentInput): Promise<Payment> => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    const existingPayment = await paymentRepository.findByOrderId(orderId);
    if (existingPayment) {
      throw new Error('Payment for this order already exists');
    }
    const payment = Payment.create(orderId, amount, paymentStatus, paidAt, uuidService);
    return paymentRepository.create(payment);
  };

export const findPaymentById = ({ paymentRepository }: PaymentUseCaseDeps) =>
  async ({ id }: FindPaymentByIdInput): Promise<Payment> => {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  };

export const findPaymentsByOrderId = ({ paymentRepository }: PaymentUseCaseDeps) =>
  async ({ orderId }: FindPaymentsByOrderIdInput): Promise<Payment[]> => {
    return paymentRepository.findByOrderId(orderId);
  };

export const findAllPayments = ({ paymentRepository }: PaymentUseCaseDeps) =>
  async (): Promise<Payment[]> => {
    return paymentRepository.findAll();
  };

export const updatePayment = ({ paymentRepository }: PaymentUseCaseDeps) =>
  async ({ id, amount, paymentStatus, paidAt }: UpdatePaymentInput): Promise<Payment> => {
    const existingPayment = await paymentRepository.findById(id);
    if (!existingPayment) {
      throw new Error('Payment not found');
    }
    if (amount !== undefined) {
      existingPayment.amount = amount;
    }
    if (paymentStatus !== undefined) {
      existingPayment.paymentStatus = paymentStatus;
    }
    if (paidAt !== undefined) {
      existingPayment.paidAt = paidAt;
    }
    return paymentRepository.update(existingPayment);
  };

export const deletePayment = ({ paymentRepository }: PaymentUseCaseDeps) =>
  async ({ id }: DeletePaymentInput): Promise<void> => {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    await paymentRepository.delete(id);
  };
