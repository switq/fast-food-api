
import OrderItem from "@src/domain/entities/OrderItem";
import { IOrderItemRepository } from "@src/application/repositories/IOrderItemRepository";
import { UUIDService } from "@src/domain/services/UUIDService";

export type OrderItemUseCaseDeps = {
  repository: IOrderItemRepository;
  uuidService: UUIDService;
};

export type CreateOrderItemInput = {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  observation?: string;
};

export type FindOrderItemByIdInput = { id: string };
export type FindOrderItemsByOrderIdInput = { orderId: string };
export type UpdateOrderItemInput = {
  id: string;
  quantity?: number;
  unitPrice?: number;
  observation?: string;
};
export type DeleteOrderItemInput = { id: string };

export const createOrderItem = ({ repository, uuidService }: OrderItemUseCaseDeps) =>
  async ({ orderId, productId, quantity, unitPrice, observation }: CreateOrderItemInput): Promise<OrderItem> => {
    const existingItems = await repository.findByOrderId(orderId);
    if (existingItems.some(item => item.productId === productId)) {
      throw new Error("This product is already added to the order");
    }
    const orderItem = OrderItem.create(orderId, productId, quantity, unitPrice, observation, uuidService);
    return repository.create(orderItem);
  };

export const findOrderItemById = ({ repository }: OrderItemUseCaseDeps) =>
  async ({ id }: FindOrderItemByIdInput): Promise<OrderItem> => {
    const orderItem = await repository.findById(id);
    if (!orderItem) {
      throw new Error("OrderItem not found");
    }
    return orderItem;
  };

export const findOrderItemsByOrderId = ({ repository }: OrderItemUseCaseDeps) =>
  async ({ orderId }: FindOrderItemsByOrderIdInput): Promise<OrderItem[]> => {
    return repository.findByOrderId(orderId);
  };

export const findAllOrderItems = ({ repository }: OrderItemUseCaseDeps) =>
  async (): Promise<OrderItem[]> => {
    return repository.findAll();
  };

export const updateOrderItem = ({ repository }: OrderItemUseCaseDeps) =>
  async ({ id, quantity, unitPrice, observation }: UpdateOrderItemInput): Promise<OrderItem> => {
    const existingOrderItem = await repository.findById(id);
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
    return repository.update(existingOrderItem);
  };

export const deleteOrderItem = ({ repository }: OrderItemUseCaseDeps) =>
  async ({ id }: DeleteOrderItemInput): Promise<void> => {
    const orderItem = await repository.findById(id);
    if (!orderItem) {
      throw new Error("OrderItem not found");
    }
    await repository.delete(id);
  };
