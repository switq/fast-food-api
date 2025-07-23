import { PrismaClient } from "@prisma/client";
import { IOrderItemRepository } from "../../../../application/repositories/IOrderItemRepository";
import OrderItem from "../../../../domain/entities/OrderItem";

export class OrderItemRepository implements IOrderItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToEntity(data: Record<string, any>): OrderItem {
    return new OrderItem(
      data.id,
      data.orderId,
      data.productId,
      data.quantity,
      data.unitPrice,
      data.observation
    );
  }

  async create(item: OrderItem): Promise<OrderItem> {
    const result = await this.prisma.orderItem.create({
      data: {
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        observation: item.observation,
      },
    });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<OrderItem | null> {
    const result = await this.prisma.orderItem.findUnique({ where: { id } });
    return result ? this.mapToEntity(result) : null;
  }

  async findAll(): Promise<OrderItem[]> {
    const results = await this.prisma.orderItem.findMany();
    return results.map((result: Record<string, any>) => this.mapToEntity(result));
  }

  async update(item: OrderItem): Promise<OrderItem> {
    const result = await this.prisma.orderItem.update({
      where: { id: item.id },
      data: {
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        observation: item.observation,
      },
    });
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.orderItem.delete({ where: { id } });
  }
  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const results = await this.prisma.orderItem.findMany({ where: { orderId } });
    return results.map((result: Record<string, any>) => this.mapToEntity(result));
  }

  async findByProductId(productId: string): Promise<OrderItem[]> {
    const results = await this.prisma.orderItem.findMany({ where: { productId } });
    return results.map((result: Record<string, any>) => this.mapToEntity(result));
  }
}

