import Payment from "@src/domain/entities/Payment";
import { IGenericRepository } from "./IGenericRepository";

export interface IPaymentRepository extends IGenericRepository<Payment> {
  findByOrderId(orderId: string): Promise<Payment[]>;
}
