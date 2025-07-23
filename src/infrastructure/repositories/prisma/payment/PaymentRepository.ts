import { PrismaClient } from "@prisma/client";
import { IPaymentRepository } from "../../../../application/repositories/IPaymentRepository";
import Payment from "../../../../domain/entities/Payment";

export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToEntity(data: Record<string, any>): Payment {
    return new Payment(
      data.id,
      data.orderId,
      data.amount,
      data.status,
      data.paidAt,
      data.createdAt,
      data.updatedAt
    );
  }

  async create(item: Payment): Promise<Payment> {
    const result = await this.prisma.payment.create({
      data: {
        id: item.id,
        orderId: item.orderId,
        amount: item.amount,
        status: item.paymentStatus,
        paidAt: item.paidAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await this.prisma.payment.findUnique({ where: { id } });
    return result ? this.mapToEntity(result) : null;
  }

  async findAll(): Promise<Payment[]> {
    const results = await this.prisma.payment.findMany();
    return results.map((result: Record<string, any>) => this.mapToEntity(result));
  }

  async update(item: Payment): Promise<Payment> {
    const result = await this.prisma.payment.update({
      where: { id: item.id },
      data: {
        orderId: item.orderId,
        amount: item.amount,
        status: item.paymentStatus,
        paidAt: item.paidAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({ where: { id } });
  }
  async findByOrderId(orderId: string): Promise<Payment[]> {
    const results = await this.prisma.payment.findMany({ where: { orderId } });
    return results.map((result: Record<string, any>) => this.mapToEntity(result));
  }
}