import { PrismaClient } from "@prisma/client";
import { IOrderRepository } from "../../../../application/repositories/IOrderRepository";
import Order, { OrderStatus } from "../../../../domain/entities/Order";
import OrderItem from "../../../../domain/entities/OrderItem";

export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapToEntity(data: Record<string, any>): Order {
    const items = data.orderItems
      ? data.orderItems.map(
          (item: Record<string, any>) =>
            new OrderItem(
              item.id,
              item.orderId,
              item.productId,
              item.quantity,
              item.unitPrice,
              item.observation
            )
        )
      : [];
    return new Order(
      data.id,
      data.customerId,
      items,
      data.status as OrderStatus
    );
  }

  async create(order: Order): Promise<Order> {
    const result = await this.prisma.$transaction(async (tx: PrismaClient) => {
      const createdOrder = await tx.order.create({
        data: {
          id: order.id,
          customerId: order.customerId,
          status: order.status,
          totalAmount: order.totalAmount,
        },
        include: { orderItems: true },
      });

      if (order.items.length > 0) {
        const orderItemsData = order.items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          observation: item.observation,
        }));
        await tx.orderItem.createMany({ data: orderItemsData });
      }

      return await tx.order.findUnique({
        where: { id: createdOrder.id },
        include: { orderItems: true },
      });
    });
    return this.mapToEntity(result!);
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const results = await this.prisma.order.findMany({
      where: { customerId },
      include: { orderItems: true },
    });
    return results.map((result: Record<string, any>) => this.mapToEntity(result));
  }

  async findAll(): Promise<Order[]> {
    const results = await this.prisma.order.findMany({
      include: { orderItems: true },
    });
    return results.map((result: Record<string, any>) => this.mapToEntity(result));
  }

  async update(order: Order): Promise<Order> {
    const result = await this.prisma.$transaction(async (tx: PrismaClient) => {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          customerId: order.customerId,
          status: order.status,
          totalAmount: order.totalAmount,
        },
        include: { orderItems: true },
      });

      await tx.orderItem.deleteMany({ where: { orderId: order.id } });

      if (order.items.length > 0) {
        const orderItemsData = order.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          observation: item.observation,
        }));
        await tx.orderItem.createMany({ data: orderItemsData });
      }

      return await tx.order.findUnique({
        where: { id: order.id },
        include: { orderItems: true },
      });
    });
    return this.mapToEntity(result!);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }
}
