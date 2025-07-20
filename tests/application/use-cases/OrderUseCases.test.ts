import OrderUseCases from "../../../src/application/use-cases/OrderUseCases";
import Order, { OrderStatus } from "../../../src/domain/entities/Order";
import OrderItem from "../../../src/domain/entities/OrderItem";
import { IOrderRepository } from "../../../src/interfaces/repositories/IOrderRepository";
import { IProductRepository } from "../../../src/interfaces/repositories/IProductRepository";
import { ICustomerRepository } from "../../../src/interfaces/repositories/ICustomerRepository";
import Customer from "../../../src/domain/entities/Customer";
import Product from "../../../src/domain/entities/Product";

describe("OrderUseCases", () => {
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;
  let mockCustomerRepository: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn(),
      findAll: jest.fn(),
      findAllSorted: jest.fn(),
    };

    mockProductRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
      findByCategory: jest.fn(),
    };

    mockCustomerRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      findByCPF: jest.fn(),
      findAll: jest.fn(),
    };
  });

  describe("createOrder", () => {
    it("should create an order successfully", async () => {
      const customer = new Customer(
        "550e8400-e29b-41d4-a716-446655440030",
        "John Doe",
        "john@example.com",
        "52998224725",
        "1234567890"
      );
      const product = new Product(
        "550e8400-e29b-41d4-a716-446655440031",
        "Burger",
        "Delicious burger",
        10.99,
        "category-id",
        undefined,
        true
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440032",
        customer.id,
        []
      );
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440033",
        "550e8400-e29b-41d4-a716-446655440034",
        product.id,
        2,
        product.price,
        "Extra cheese"
      );

      mockCustomerRepository.findById.mockResolvedValue(customer);
      mockProductRepository.findById.mockResolvedValue(product);
      mockOrderRepository.create.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.createOrder(
        [orderItem],
        mockOrderRepository,
        mockProductRepository,
        customer.id,
        mockCustomerRepository
      );

      expect(result).toBeDefined();
      expect(mockOrderRepository.create).toHaveBeenCalled();
      expect(mockOrderRepository.update).toHaveBeenCalled();
    });

    it("should throw error when customer not found", async () => {
      mockCustomerRepository.findById.mockResolvedValue(null);

      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440070",
        "550e8400-e29b-41d4-a716-446655440071",
        "550e8400-e29b-41d4-a716-446655440080",
        1,
        10.99
      );

      await expect(
        OrderUseCases.createOrder(
          [orderItem],
          mockOrderRepository,
          mockProductRepository,
          "customer-id",
          mockCustomerRepository
        )
      ).rejects.toThrow("Customer not found");
    });

    it("should throw error when product not found", async () => {
      const customer = new Customer(
        "550e8400-e29b-41d4-a716-446655440036",
        "John Doe",
        "john@example.com",
        "52998224725",
        "1234567890"
      );
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440072",
        "550e8400-e29b-41d4-a716-446655440073",
        "550e8400-e29b-41d4-a716-446655440081",
        1,
        10.99
      );

      mockCustomerRepository.findById.mockResolvedValue(customer);
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.createOrder(
          [orderItem],
          mockOrderRepository,
          mockProductRepository,
          customer.id,
          mockCustomerRepository
        )
      ).rejects.toThrow(
        "Product with ID 550e8400-e29b-41d4-a716-446655440081 not found"
      );
    });
  });

  describe("findOrderById", () => {
    it("should find order by id successfully", async () => {
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440044",
        "550e8400-e29b-41d4-a716-446655440056",
        "550e8400-e29b-41d4-a716-446655440057",
        1,
        10.99
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440037",
        "550e8400-e29b-41d4-a716-446655440050",
        [orderItem]
      );
      mockOrderRepository.findById.mockResolvedValue(order);

      const result = await OrderUseCases.findOrderById(
        "order-id",
        mockOrderRepository
      );

      expect(result).toBe(order);
      expect(mockOrderRepository.findById).toHaveBeenCalledWith("order-id");
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.findOrderById("non-existent-order", mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status successfully", async () => {
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440045",
        "550e8400-e29b-41d4-a716-446655440058",
        "550e8400-e29b-41d4-a716-446655440059",
        1,
        10.99
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440038",
        "550e8400-e29b-41d4-a716-446655440051",
        [orderItem]
      );
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.updateOrderStatus(
        "order-id",
        OrderStatus.CONFIRMED,
        mockOrderRepository
      );

      expect(result).toBe(order);
      expect(mockOrderRepository.update).toHaveBeenCalled();
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.updateOrderStatus(
          "non-existent-order",
          OrderStatus.CONFIRMED,
          mockOrderRepository
        )
      ).rejects.toThrow("Order not found");
    });
  });

  describe("addItemsToOrder", () => {
    it("should add items to order successfully", async () => {
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440046",
        "550e8400-e29b-41d4-a716-446655440060",
        "550e8400-e29b-41d4-a716-446655440061",
        1,
        10.99
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440039",
        "550e8400-e29b-41d4-a716-446655440052",
        [orderItem]
      );
      const product = new Product(
        "550e8400-e29b-41d4-a716-446655440040",
        "Burger",
        "Delicious burger",
        10.99,
        "category-id",
        undefined,
        true
      );
      const newOrderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440074",
        order.id,
        product.id,
        2,
        product.price
      );

      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.addItemsToOrder(
        "order-id",
        [newOrderItem],
        mockOrderRepository,
        mockProductRepository
      );

      expect(result).toBe(order);
      expect(mockOrderRepository.update).toHaveBeenCalled();
    });

    it("should throw error when trying to add items to non-pending order", async () => {
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440047",
        "550e8400-e29b-41d4-a716-446655440062",
        "550e8400-e29b-41d4-a716-446655440063",
        1,
        10.99
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440041",
        "550e8400-e29b-41d4-a716-446655440053",
        [orderItem]
      );
      order.confirm(); // Change status from PENDING to CONFIRMED

      const newOrderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440075",
        order.id,
        "550e8400-e29b-41d4-a716-446655440082",
        1,
        10.99
      );

      mockOrderRepository.findById.mockResolvedValue(order);

      await expect(
        OrderUseCases.addItemsToOrder(
          "order-id",
          [newOrderItem],
          mockOrderRepository,
          mockProductRepository
        )
      ).rejects.toThrow("Cannot add items to an order that is not pending");
    });
  });

  describe("deleteOrder", () => {
    it("should delete order successfully", async () => {
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440048",
        "550e8400-e29b-41d4-a716-446655440064",
        "550e8400-e29b-41d4-a716-446655440065",
        1,
        10.99
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440042",
        "550e8400-e29b-41d4-a716-446655440054",
        [orderItem]
      );
      mockOrderRepository.findById.mockResolvedValue(order);

      await OrderUseCases.deleteOrder("order-id", mockOrderRepository);

      expect(mockOrderRepository.delete).toHaveBeenCalledWith("order-id");
    });

    it("should throw error when trying to delete non-pending order", async () => {
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440049",
        "550e8400-e29b-41d4-a716-446655440066",
        "550e8400-e29b-41d4-a716-446655440067",
        1,
        10.99
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440043",
        "550e8400-e29b-41d4-a716-446655440055",
        [orderItem]
      );
      order.confirm(); // Change status from PENDING to CONFIRMED

      mockOrderRepository.findById.mockResolvedValue(order);

      await expect(
        OrderUseCases.deleteOrder("order-id", mockOrderRepository)
      ).rejects.toThrow("Cannot delete an order that is not pending");
    });
  });

  describe("listSortedOrders", () => {
    it("should return sorted orders", async () => {
      const orders = [
        new Order(
          "550e8400-e29b-41d4-a716-446655440003",
          "550e8400-e29b-41d4-a716-446655440013",
          [],
          OrderStatus.READY,
          "approved"
        ),
        new Order(
          "550e8400-e29b-41d4-a716-446655440002",
          "550e8400-e29b-41d4-a716-446655440012",
          [],
          OrderStatus.PREPARING,
          "approved"
        ),
        new Order(
          "550e8400-e29b-41d4-a716-446655440005",
          "550e8400-e29b-41d4-a716-446655440015",
          [],
          OrderStatus.PREPARING,
          "approved"
        ),
        new Order(
          "550e8400-e29b-41d4-a716-446655440004",
          "550e8400-e29b-41d4-a716-446655440014",
          [],
          OrderStatus.CONFIRMED,
          "approved"
        ),
      ];
      mockOrderRepository.findAllSorted.mockResolvedValue(orders);

      const result = await OrderUseCases.listSortedOrders(mockOrderRepository);

      expect(result).toEqual(orders);
      expect(mockOrderRepository.findAllSorted).toHaveBeenCalled();
    });
  });
});
