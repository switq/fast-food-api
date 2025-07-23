
import {
  createOrderItem,
  findOrderItemById,
  findOrderItemsByOrderId,
  findAllOrderItems,
  updateOrderItem,
  deleteOrderItem,
  OrderItemUseCaseDeps
} from "./OrderItemUseCases";

import { IOrderItemRepository } from "@src/application/repositories/IOrderItemRepository";
import { UUIDService } from "@src/domain/services/UUIDService";

export const makeOrderItemUseCases = (
  repository: IOrderItemRepository,
  uuidService: UUIDService
) => {
  const deps: OrderItemUseCaseDeps = { repository, uuidService };
  return {
    createOrderItem: createOrderItem(deps),
    findOrderItemById: findOrderItemById(deps),
    findOrderItemsByOrderId: findOrderItemsByOrderId(deps),
    findAllOrderItems: findAllOrderItems(deps),
    updateOrderItem: updateOrderItem(deps),
    deleteOrderItem: deleteOrderItem(deps),
  };
};
