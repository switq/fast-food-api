import OrderItem from "../../../domain/entities/OrderItem";
import { IOrderItemRepository } from "../../repositories/IOrderItemRepository";
import { UUIDService } from "../../../domain/services/UUIDService";

class OrderItemUseCases {
    constructor( 
      private readonly orderItemRepository: IOrderItemRepository,
      private readonly uuidService: UUIDService
    ) {}
  async createOrderItem(
    orderId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    observation: string | undefined
  ): Promise<OrderItem> {
    // Check for duplicate product in the same order
    const existingItems = await this.orderItemRepository.findByOrderId(orderId);
    if (existingItems.some(item => item.productId === productId)) {
      throw new Error("This product is already added to the order");
    }

    const orderItem = OrderItem.create(
      orderId,
      productId,
      quantity,
      unitPrice,
      observation,
      this.uuidService
    );
    return this.orderItemRepository.create(orderItem);
  }

  async findOrderItemById(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findById(id);
    if (!orderItem) {
      throw new Error("OrderItem not found");
    }
    return orderItem;
  }

  async findOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.orderItemRepository.findByOrderId(orderId);
  }

  async findAllOrderItems(): Promise<OrderItem[]> {
    return this.orderItemRepository.findAll();
  }

  async updateOrderItem(
    id: string,
    quantity: number | undefined,
    unitPrice: number | undefined,
    observation: string | undefined
  ): Promise<OrderItem> {
    const existingOrderItem = await this.orderItemRepository.findById(id);
    if (!existingOrderItem) {
      throw new Error("OrderItem not found");
    }

    if (quantity !== undefined) {
      existingOrderItem.quantity = quantity;
    }
    if (unitPrice !== undefined) {
      existingOrderItem.unitPrice = unitPrice;
    }
    if (observation !== undefined) {
      existingOrderItem.observation = observation;
    }

    return this.orderItemRepository.update(existingOrderItem);
  }

  async deleteOrderItem(id: string): Promise<void> {
    const orderItem = await this.orderItemRepository.findById(id);
    if (!orderItem) {
      throw new Error("OrderItem not found");
    }
    await this.orderItemRepository.delete(id);
  }
}

export default OrderItemUseCases;
