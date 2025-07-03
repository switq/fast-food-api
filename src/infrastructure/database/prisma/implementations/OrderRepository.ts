import { BaseRepository } from "./BaseRepository";
import { IOrderRepository } from "../../../../domain/repositories/IOrderRepository";
import Order, { OrderStatus } from "../../../../domain/entities/Order";
import OrderItem from "../../../../domain/entities/OrderItem";
import { PrismaClient } from "@prisma/client";

export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  protected getModelName(): keyof PrismaClient {
    return "order";
  }

  protected mapToEntity(data: Record<string, any>): Order {
    // Map order items if they exist
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

  protected mapToPrisma(entity: Order): Record<string, any> {
    return {
      id: entity.id,
      customerId: entity.customerId,
      status: entity.status,
      totalAmount: entity.totalAmount,
    };
  }

  async create(order: Order): Promise<Order> {
    // Create order with items in a transaction
    const result = await this.prisma.$transaction(async (tx: any) => {
      // Create the order
      const createdOrder = await tx.order.create({
        data: this.mapToPrisma(order),
        include: {
          orderItems: true,
        },
      });

      // Create order items
      if (order.items.length > 0) {
        const orderItemsData = order.items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          observation: item.observation,
        }));

        await tx.orderItem.createMany({
          data: orderItemsData,
        });
      }

      // Return the complete order with items
      return await tx.order.findUnique({
        where: { id: createdOrder.id },
        include: {
          orderItems: true,
        },
      });
    });

    return this.mapToEntity(result!);
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const results = await this.prisma.order.findMany({
      where: { customerId },
      include: {
        orderItems: true,
      },
    });
    return results.map((result: Record<string, any>) =>
      this.mapToEntity(result)
    );
  }

  async findAll(): Promise<Order[]> {
    const results = await this.prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });
    return results.map((result: Record<string, any>) =>
      this.mapToEntity(result)
    );
  }

  async update(order: Order): Promise<Order> {
    // Update order with items in a transaction
    const result = await this.prisma.$transaction(async (tx: any) => {
      // Update the order
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: this.mapToPrisma(order),
        include: {
          orderItems: true,
        },
      });

      // Delete existing order items
      await tx.orderItem.deleteMany({
        where: { orderId: order.id },
      });

      // Create new order items
      if (order.items.length > 0) {
        const orderItemsData = order.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          observation: item.observation,
        }));

        await tx.orderItem.createMany({
          data: orderItemsData,
        });
      }

      // Return the complete updated order
      return await tx.order.findUnique({
        where: { id: order.id },
        include: {
          orderItems: true,
        },
      });
    });

    return this.mapToEntity(result!);
  }
}
