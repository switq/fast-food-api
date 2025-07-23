import { UUIDService } from "@src/domain/services/UUIDService";
import Customer from "@src/domain/entities/Customer";
import { ICustomerRepository } from "@src/application/repositories/ICustomerRepository";

// Dependency object for all use cases
export type CustomerUseCaseDeps = {
  repository: ICustomerRepository;
  uuidService: UUIDService;
};

export type CreateCustomerInput = { name: string; email: string; cpf: string; phone?: string };
export type FindCustomerByIdInput = { id: string };
export type FindCustomerByEmailInput = { email: string };
export type FindCustomerByCPFInput = { cpf: string };
export type UpdateCustomerInput = { id: string; name?: string; email?: string; cpf?: string; phone?: string };
export type DeleteCustomerInput = { id: string };

export const createCustomer = ({ repository, uuidService }: CustomerUseCaseDeps) =>
  async ({ name, email, cpf, phone }: CreateCustomerInput): Promise<Customer> => {
    const existingEmail = await repository.findByEmail(email);
    if (existingEmail) {
      throw new Error("A customer with this email already exists");
    }
    const existingCPF = await repository.findByCPF(cpf);
    if (existingCPF) {
      throw new Error("A customer with this CPF already exists");
    }
    const customer = Customer.create(name, email, cpf, phone, uuidService);
    return repository.create(customer);
  };

export const findCustomerById = ({ repository }: CustomerUseCaseDeps) =>
  async ({ id }: FindCustomerByIdInput): Promise<Customer> => {
    const customer = await repository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  };

export const findCustomerByEmail = ({ repository }: CustomerUseCaseDeps) =>
  async ({ email }: FindCustomerByEmailInput): Promise<Customer> => {
    const customer = await repository.findByEmail(email);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  };

export const findCustomerByCPF = ({ repository }: CustomerUseCaseDeps) =>
  async ({ cpf }: FindCustomerByCPFInput): Promise<Customer> => {
    const customer = await repository.findByCPF(cpf);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  };

export const findAllCustomers = ({ repository }: CustomerUseCaseDeps) =>
  async (): Promise<Customer[]> => {
    return repository.findAll();
  };

export const updateCustomer = ({ repository }: CustomerUseCaseDeps) =>
  async ({ id, name, email, cpf, phone }: UpdateCustomerInput): Promise<Customer> => {
    const existingCustomer = await repository.findById(id);
    if (!existingCustomer) {
      throw new Error("Customer not found");
    }
    if (email !== undefined && email !== existingCustomer.email) {
      const customerWithSameEmail = await repository.findByEmail(email);
      if (customerWithSameEmail) {
        throw new Error("A customer with this email already exists");
      }
      existingCustomer.email = email;
    }
    if (cpf !== undefined && cpf !== existingCustomer.cpf) {
      const customerWithSameCPF = await repository.findByCPF(cpf);
      if (customerWithSameCPF) {
        throw new Error("A customer with this CPF already exists");
      }
      existingCustomer.cpf = cpf;
    }
    if (name !== undefined) {
      existingCustomer.name = name;
    }
    if (phone !== undefined) {
      existingCustomer.phone = phone;
    }
    return repository.update(existingCustomer);
  };

export const deleteCustomer = ({ repository }: CustomerUseCaseDeps) =>
  async ({ id }: DeleteCustomerInput): Promise<void> => {
    const customer = await repository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    await repository.delete(id);
  };
