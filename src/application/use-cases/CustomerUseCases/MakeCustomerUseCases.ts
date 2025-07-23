import {
  createCustomer,
  findCustomerById,
  findCustomerByEmail,
  findCustomerByCPF,
  findAllCustomers,
  updateCustomer,
  deleteCustomer,
  CustomerUseCaseDeps
} from "./CustomerUseCases";

export const makeCustomerUseCases = (
  repository: import("@src/application/repositories/ICustomerRepository").ICustomerRepository,
  uuidService: import("@src/domain/services/UUIDService").UUIDService
) => {
  const deps: CustomerUseCaseDeps = { repository, uuidService };
  return {
    createCustomer: createCustomer(deps),
    findCustomerById: findCustomerById(deps),
    findCustomerByEmail: findCustomerByEmail(deps),
    findCustomerByCPF: findCustomerByCPF(deps),
    findAllCustomers: findAllCustomers(deps),
    updateCustomer: updateCustomer(deps),
    deleteCustomer: deleteCustomer(deps),
  };
};
