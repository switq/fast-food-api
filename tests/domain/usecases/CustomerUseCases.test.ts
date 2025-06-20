import CustomerUseCases from "../../../src/domain/usecases/CustomerUseCases";
import Customer from "../../../src/domain/entities/Customer";
import { ICustomerRepository } from "../../../src/domain/repositories/ICustomerRepository";

describe("CustomerUseCases", () => {
  let customerUseCases: CustomerUseCases;
  let mockCustomerRepository: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    mockCustomerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      findByCPF: jest.fn(),
      findAll: jest.fn(),
    };

    customerUseCases = new CustomerUseCases();
  });

  describe("createCustomer", () => {
    it("should create a customer successfully", async () => {
      const customer = new Customer(
        "550e8400-e29b-41d4-a716-446655440000",
        "John Doe",
        "john@example.com",
        "52998224725",
        "1234567890"
      );
      mockCustomerRepository.create.mockResolvedValue(customer);
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.findByCPF.mockResolvedValue(null);

      const result = await customerUseCases.createCustomer(
        "John Doe",
        "john@example.com",
        "52998224725",
        "1234567890",
        mockCustomerRepository
      );

      expect(result).toBe(customer);
      expect(mockCustomerRepository.create).toHaveBeenCalled();
    });
  });

  describe("findCustomerById", () => {
    it("should find customer by id successfully", async () => {
      const customer = new Customer(
        "550e8400-e29b-41d4-a716-446655440001",
        "John Doe",
        "john@example.com",
        "52998224725",
        "1234567890"
      );
      mockCustomerRepository.findById.mockResolvedValue(customer);

      const result = await customerUseCases.findCustomerById(
        "customer-id",
        mockCustomerRepository
      );

      expect(result).toBe(customer);
      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(
        "customer-id"
      );
    });

    it("should throw error when customer not found", async () => {
      mockCustomerRepository.findById.mockResolvedValue(null);

      await expect(
        customerUseCases.findCustomerById(
          "non-existent-customer",
          mockCustomerRepository
        )
      ).rejects.toThrow("Customer not found");
    });
  });

  describe("updateCustomer", () => {
    it("should update customer successfully", async () => {
      const customer = new Customer(
        "550e8400-e29b-41d4-a716-446655440002",
        "John Doe",
        "john@example.com",
        "52998224725",
        "1234567890"
      );
      mockCustomerRepository.findById.mockResolvedValue(customer);
      mockCustomerRepository.findByEmail.mockResolvedValue(null);
      mockCustomerRepository.findByCPF.mockResolvedValue(null);
      mockCustomerRepository.update.mockResolvedValue(customer);

      const result = await customerUseCases.updateCustomer(
        "customer-id",
        "John Updated",
        "john.updated@example.com",
        "52998224725",
        "9876543210",
        mockCustomerRepository
      );

      expect(result).toBe(customer);
      expect(mockCustomerRepository.update).toHaveBeenCalled();
    });

    it("should throw error when customer not found", async () => {
      mockCustomerRepository.findById.mockResolvedValue(null);

      await expect(
        customerUseCases.updateCustomer(
          "non-existent-customer",
          "John Updated",
          "john.updated@example.com",
          "52998224725",
          "9876543210",
          mockCustomerRepository
        )
      ).rejects.toThrow("Customer not found");
    });
  });

  describe("deleteCustomer", () => {
    it("should delete customer successfully", async () => {
      const customer = new Customer(
        "550e8400-e29b-41d4-a716-446655440003",
        "John Doe",
        "john@example.com",
        "52998224725",
        "1234567890"
      );
      mockCustomerRepository.findById.mockResolvedValue(customer);

      await customerUseCases.deleteCustomer(
        "customer-id",
        mockCustomerRepository
      );

      expect(mockCustomerRepository.delete).toHaveBeenCalledWith("customer-id");
    });

    it("should throw error when customer not found", async () => {
      mockCustomerRepository.findById.mockResolvedValue(null);

      await expect(
        customerUseCases.deleteCustomer(
          "non-existent-customer",
          mockCustomerRepository
        )
      ).rejects.toThrow("Customer not found");
    });
  });
});
