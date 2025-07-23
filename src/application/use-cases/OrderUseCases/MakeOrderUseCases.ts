
import {
  createOrder,
  findOrderById,
  findOrdersByCustomer,
  findAllOrders,
  updateOrderStatus,
  addItemsToOrder,
  updateItemQuantity,
  deleteOrder,
  OrderUseCaseDeps
} from "./OrderUseCases";

import { IOrderRepository } from "@src/application/repositories/IOrderRepository";
import { IProductRepository } from "@src/application/repositories/IProductRepository";
import { ICustomerRepository } from "@src/application/repositories/ICustomerRepository";
import { UUIDService } from "@src/domain/services/UUIDService";

export const makeOrderUseCases = (
  orderRepository: IOrderRepository,
  productRepository: IProductRepository,
  uuidService: UUIDService,
  customerRepository?: ICustomerRepository
) => {
  const deps: OrderUseCaseDeps = { orderRepository, productRepository, uuidService, customerRepository };
  return {
    createOrder: createOrder(deps),
    findOrderById: findOrderById(deps),
    findOrdersByCustomer: findOrdersByCustomer(deps),
    findAllOrders: findAllOrders(deps),
    updateOrderStatus: updateOrderStatus(deps),
    addItemsToOrder: addItemsToOrder(deps),
    updateItemQuantity: updateItemQuantity(deps),
    deleteOrder: deleteOrder(deps),
  };
};
