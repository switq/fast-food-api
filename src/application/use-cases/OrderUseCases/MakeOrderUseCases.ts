
import { UUIDService } from "../../../domain/services/UUIDService";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IProductRepository } from "../../repositories/IProductRepository";
import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import OrderUseCases from "../OrderUseCases/OrderUseCases";

export const makeOrderUseCases = (
  orderRepository: IOrderRepository,
  productRepository: IProductRepository,
  uuidService: UUIDService,
  customerRepository?: ICustomerRepository
): OrderUseCases => new OrderUseCases(orderRepository, productRepository, uuidService, customerRepository);
