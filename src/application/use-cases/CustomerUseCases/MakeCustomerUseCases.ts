import { UUIDService } from "../../../domain/services/UUIDService";
import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import CustomerUseCases from "./CustomerUseCases";

export const makeCustomerUseCases = (
  repository: ICustomerRepository,
  uuidService: UUIDService
): CustomerUseCases => new CustomerUseCases(repository, uuidService);
