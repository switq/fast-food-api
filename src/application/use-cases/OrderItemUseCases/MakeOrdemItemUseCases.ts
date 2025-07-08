import { UUIDService } from "../../../domain/services/UUIDService";
import { IOrderItemRepository } from "../../repositories/IOrderItemRepository";
import OrderItemUseCases from "./OrderItemUseCases";

export const makeOrderItemUseCases = (
  repository: IOrderItemRepository,
  uuidService: UUIDService
): OrderItemUseCases => new OrderItemUseCases(repository, uuidService);
