import Payment, { PaymentStatus } from '../../../domain/entities/Payment';
import { IPaymentRepository } from '../../repositories/IPaymentRepository';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { UUIDService } from '../../../domain/services/UUIDService';

class PaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly uuidService: UUIDService
  ) {}

  async createPayment(
    orderId: string,
    amount: number,
    paymentStatus: PaymentStatus,
    paidAt: Date
  ): Promise<Payment> {
    // Validate order exists
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const existingPayment = await this.paymentRepository.findByOrderId(orderId);
    if (existingPayment) {
      throw new Error('Payment for this order already exists');
    }

    const payment = Payment.create(
      orderId,
      amount,
      paymentStatus,
      paidAt,
      this.uuidService
    );
    return this.paymentRepository.create(payment);
  }

  async findPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  async findPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    return this.paymentRepository.findByOrderId(orderId);
  }

  async findAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async updatePayment(
    id: string,
    amount?: number,
    paymentStatus?: PaymentStatus,
    paidAt?: Date
  ): Promise<Payment> {
    const existingPayment = await this.paymentRepository.findById(id);
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

    return this.paymentRepository.update(existingPayment);
  }

  async deletePayment(id: string): Promise<void> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    await this.paymentRepository.delete(id);
  }
}

export default PaymentUseCase;
