import Payment from "../../domain/entities/Payment";

export interface IPaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment[]>;
  findAll(): Promise<Payment[]>;
  update(payment: Payment): Promise<Payment>;
  delete(id: string): Promise<void>;
}
