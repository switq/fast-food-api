import OrderUseCases from "../../../src/application/use-cases/OrderUseCases";
import Order, { OrderStatus } from "../../../src/domain/entities/Order";
import OrderItem from "../../../src/domain/entities/OrderItem";
import { IOrderRepository } from "../../../src/interfaces/repositories/IOrderRepository";
import { IProductRepository } from "../../../src/interfaces/repositories/IProductRepository";
import { ICustomerRepository } from "../../../src/interfaces/repositories/ICustomerRepository";
import Customer from "../../../src/domain/entities/Customer";
import Product from "../../../src/domain/entities/Product";
import { v4 as uuidv4 } from "uuid";

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
      findByStatus: jest.fn(),
    };

    mockProductRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
      findByCategory: jest.fn(),
      updateStock: jest.fn(),
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
        true,
        10
      );
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440032",
        customer.id,
        []
      );
      const orderItem = new OrderItem(
        product.id,
        2,
        product.price,
        order.id,
        undefined,
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
        "550e8400-e29b-41d4-a716-446655440080",
        1,
        10.99,
        undefined,
        undefined,
        undefined
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
        1,
        10.99,
        undefined,
        undefined,
        undefined
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
        "Product with ID 550e8400-e29b-41d4-a716-446655440072 not found"
      );
    });
  });

  describe("findOrderById", () => {
    it("should find order by id successfully", async () => {
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440044",
        1,
        10.99,
        undefined,
        undefined,
        undefined
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
        "550e8400-e29b-41d4-a716-446655440059",
        1,
        10.99,
        "550e8400-e29b-41d4-a716-446655440058"
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
  describe("findOrdersByStatus", () => {
    it("should return orders by status", async () => {
      const orders = [
        new Order(uuidv4(), "550e8400-e29b-41d4-a716-446655440001", [], OrderStatus.PREPARING),
        new Order(uuidv4(), "550e8400-e29b-41d4-a716-446655440002", [], OrderStatus.PREPARING),
      ];
      mockOrderRepository.findByStatus.mockResolvedValue(orders);

      const result = await OrderUseCases.findOrdersByStatus("PREPARING", mockOrderRepository);

      expect(result).toEqual(orders);
      expect(mockOrderRepository.findByStatus).toHaveBeenCalledWith("PREPARING");
    });
  });describe("addItemsToOrder", () => {
    it("should add items to pending order", async () => {
      const order = new Order("550e8400-e29b-41d4-a716-446655440001");
      const product = new Product(
        "550e8400-e29b-41d4-a716-446655440002", 
        "Burger", 
        "Delicious burger", 
        15.99, 
        "550e8400-e29b-41d4-a716-446655440003", 
        undefined, 
        true
      );
      const newItems = [new OrderItem(
        "550e8400-e29b-41d4-a716-446655440002", // productId
        2, // quantity
        15.99, // unitPrice
        "550e8400-e29b-41d4-a716-446655440001", // orderId
        "550e8400-e29b-41d4-a716-446655440004", // id
        "No onions" // observation
      )];

      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.addItemsToOrder(
        "order-1", newItems, mockOrderRepository, mockProductRepository
      );

      expect(result).toEqual(order);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.addItemsToOrder("order-1", [], mockOrderRepository, mockProductRepository)
      ).rejects.toThrow("Order not found");
    });    it("should throw error when order is not pending", async () => {
      const order = new Order(uuidv4(), "550e8400-e29b-41d4-a716-446655440001");
      // Add an item so confirm() doesn't fail
      const orderItem = new OrderItem(uuidv4(), 1, 10.0, order.id, uuidv4());
      order.addItem(orderItem);
      order.confirm(); // Change status to CONFIRMED
      mockOrderRepository.findById.mockResolvedValue(order);

      await expect(
        OrderUseCases.addItemsToOrder("order-1", [], mockOrderRepository, mockProductRepository)
      ).rejects.toThrow("Cannot add items to an order that is not pending");
    });it("should throw error when product not found", async () => {
      const order = new Order("550e8400-e29b-41d4-a716-446655440001");
      const newItems = [new OrderItem(
        "550e8400-e29b-41d4-a716-446655440002", // productId
        2, // quantity
        15.99, // unitPrice
        "550e8400-e29b-41d4-a716-446655440001", // orderId
        "550e8400-e29b-41d4-a716-446655440004", // id
        "No onions" // observation
      )];

      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.addItemsToOrder("order-1", newItems, mockOrderRepository, mockProductRepository)
      ).rejects.toThrow("Product with ID 550e8400-e29b-41d4-a716-446655440002 not found");
    });

    it("should throw error when product not available", async () => {
      const order = new Order("550e8400-e29b-41d4-a716-446655440001");
      const product = new Product(
        "550e8400-e29b-41d4-a716-446655440002", 
        "Burger", 
        "Delicious burger", 
        15.99, 
        "550e8400-e29b-41d4-a716-446655440003", 
        undefined, 
        false // not available
      );
      const newItems = [new OrderItem(
        "550e8400-e29b-41d4-a716-446655440002", // productId
        2, // quantity
        15.99, // unitPrice
        "550e8400-e29b-41d4-a716-446655440001", // orderId
        "550e8400-e29b-41d4-a716-446655440004", // id
        "No onions" // observation
      )];

      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);

      await expect(
        OrderUseCases.addItemsToOrder("order-1", newItems, mockOrderRepository, mockProductRepository)
      ).rejects.toThrow("Product Burger is not available");
    });
  });
  describe("updateItemQuantity", () => {
    it("should update item quantity", async () => {
      const orderId = uuidv4();
      const order = new Order(orderId, "550e8400-e29b-41d4-a716-446655440001");
      const orderItem = new OrderItem("550e8400-e29b-41d4-a716-446655440002", 2, 15.99, orderId, uuidv4(), "No onions");
      order.addItem([orderItem]);

      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.updateItemQuantity(
        "order-1", orderItem.id, 3, mockOrderRepository
      );

      expect(result).toEqual(order);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.updateItemQuantity("order-1", "item-1", 3, mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  describe("confirmOrder", () => {    it("should confirm order", async () => {
      const order = new Order(uuidv4(), uuidv4());
      // Add an item so confirm() doesn't fail
      const orderItem = new OrderItem(uuidv4(), 1, 10.0, order.id, uuidv4());
      order.addItem(orderItem);
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.confirmOrder(uuidv4(), mockOrderRepository);

      expect(result).toEqual(order);
      expect(order.status).toBe(OrderStatus.CONFIRMED);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.confirmOrder("order-1", mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  describe("confirmPayment", () => {    it("should confirm payment", async () => {
      const order = new Order(uuidv4(), uuidv4());
      // Add an item so confirm() doesn't fail
      const orderItem = new OrderItem(uuidv4(), 1, 10.0, order.id, uuidv4());
      order.addItem(orderItem);
      order.confirm(); // First confirm order
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.confirmPayment(uuidv4(), mockOrderRepository);

      expect(result).toEqual(order);
      expect(order.status).toBe(OrderStatus.PAYMENT_CONFIRMED);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.confirmPayment("order-1", mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  describe("startPreparingOrder", () => {    it("should start preparing order", async () => {
      const order = new Order(uuidv4(), uuidv4());
      // Add an item so confirm() doesn't fail
      const orderItem = new OrderItem(uuidv4(), 1, 10.0, order.id, uuidv4());
      order.addItem(orderItem);
      order.confirm();
      order.confirmPayment();
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.startPreparingOrder(uuidv4(), mockOrderRepository);

      expect(result).toEqual(order);
      expect(order.status).toBe(OrderStatus.PREPARING);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.startPreparingOrder("order-1", mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  describe("markOrderAsReady", () => {
    it("should mark order as ready", async () => {      const order = new Order(uuidv4(), uuidv4());
      // Add an item so confirm() doesn't fail
      const orderItem = new OrderItem(uuidv4(), 1, 10.0, order.id, uuidv4());
      order.addItem(orderItem);
      order.confirm();
      order.confirmPayment();
      order.startPreparing();
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.markOrderAsReady(uuidv4(), mockOrderRepository);

      expect(result).toEqual(order);
      expect(order.status).toBe(OrderStatus.READY);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.markOrderAsReady("order-1", mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  describe("markOrderAsDelivered", () => {    it("should mark order as delivered", async () => {
      const order = new Order(uuidv4(), uuidv4());
      // Add an item so confirm() doesn't fail
      const orderItem = new OrderItem(uuidv4(), 1, 10.0, order.id, uuidv4());
      order.addItem(orderItem);
      order.confirm();
      order.confirmPayment();
      order.startPreparing();
      order.markAsReady();
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.markOrderAsDelivered(uuidv4(), mockOrderRepository);

      expect(result).toEqual(order);
      expect(order.status).toBe(OrderStatus.DELIVERED);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.markOrderAsDelivered("order-1", mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  describe("cancelOrder", () => {
    it("should cancel order", async () => {
      const order = new Order(uuidv4(), uuidv4());
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.cancelOrder(uuidv4(), mockOrderRepository);

      expect(result).toEqual(order);
      expect(order.status).toBe(OrderStatus.CANCELLED);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.cancelOrder("order-1", mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  describe("updateOrderStatus", () => {    it("should update order status to CONFIRMED", async () => {
      const order = new Order(uuidv4(), uuidv4());
      // Add an item so confirm() doesn't fail
      const orderItem = new OrderItem(uuidv4(), 1, 10.0, order.id, uuidv4());
      order.addItem(orderItem);
      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.update.mockResolvedValue(order);

      const result = await OrderUseCases.updateOrderStatus(
        uuidv4(), OrderStatus.CONFIRMED, mockOrderRepository
      );

      expect(result).toEqual(order);
      expect(order.status).toBe(OrderStatus.CONFIRMED);
    });

    it("should throw error for invalid status transition", async () => {
      const order = new Order(uuidv4(), uuidv4());
      mockOrderRepository.findById.mockResolvedValue(order);

      await expect(
        OrderUseCases.updateOrderStatus(uuidv4(), "INVALID_STATUS" as OrderStatus, mockOrderRepository)
      ).rejects.toThrow("Invalid status transition to INVALID_STATUS");
    });

    it("should throw error when order not found", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.updateOrderStatus("order-1", OrderStatus.CONFIRMED, mockOrderRepository)
      ).rejects.toThrow("Order not found");
    });
  });
  // Tests for "WithProducts" methods
  describe("findOrderByIdWithProducts", () => {
    it("should return order with products", async () => {
      const order = new Order("550e8400-e29b-41d4-a716-446655440001");
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440002", // productId
        2, // quantity
        15.99, // unitPrice
        "550e8400-e29b-41d4-a716-446655440001", // orderId
        "550e8400-e29b-41d4-a716-446655440004", // id
        "No onions" // observation
      );
      order.addItem([orderItem]);
      
      const product = new Product(
        "550e8400-e29b-41d4-a716-446655440002", 
        "Burger", 
        "Delicious burger", 
        15.99, 
        "550e8400-e29b-41d4-a716-446655440003"
      );
      const expectedProducts = new Map([["550e8400-e29b-41d4-a716-446655440002", product]]);

      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);

      const result = await OrderUseCases.findOrderByIdWithProducts(
        "order-1", mockOrderRepository, mockProductRepository
      );

      expect(result.order).toEqual(order);
      expect(result.products).toEqual(expectedProducts);
    });
  });
  describe("findOrdersByCustomerWithProducts", () => {
    it("should return customer orders with products", async () => {
      const order = new Order("550e8400-e29b-41d4-a716-446655440001");
      const orderItem = new OrderItem(
        "550e8400-e29b-41d4-a716-446655440002", // productId
        2, // quantity
        15.99, // unitPrice
        "550e8400-e29b-41d4-a716-446655440001", // orderId
        "550e8400-e29b-41d4-a716-446655440004", // id
        "No onions" // observation
      );
      order.addItem([orderItem]);
      
      const orders = [order];
      const product = new Product(
        "550e8400-e29b-41d4-a716-446655440002", 
        "Burger", 
        "Delicious burger", 
        15.99, 
        "550e8400-e29b-41d4-a716-446655440003"
      );
      const expectedProducts = new Map([["550e8400-e29b-41d4-a716-446655440002", product]]);

      mockOrderRepository.findByCustomerId.mockResolvedValue(orders);
      mockProductRepository.findById.mockResolvedValue(product);

      const result = await OrderUseCases.findOrdersByCustomerWithProducts(
        "customer-1", mockOrderRepository, mockProductRepository
      );

      expect(result.orders).toEqual(orders);
      expect(result.products).toEqual(expectedProducts);
    });
  });  describe("findAllOrdersWithProducts", () => {
    it("should return all orders with products", async () => {
      const order = new Order(uuidv4(), uuidv4());
      const orderItem = new OrderItem(uuidv4(), 2, 15.99, order.id);
      order.addItem([orderItem]);
      
      const orders = [order];
      const product = new Product(
        orderItem.productId,
        "Burger", 
        "Delicious burger", 
        15.99, 
        uuidv4(), 
        undefined, 
        true
      );
      const expectedProducts = new Map([[orderItem.productId, product]]);

      mockOrderRepository.findAll.mockResolvedValue(orders);
      mockProductRepository.findById.mockResolvedValue(product);

      const result = await OrderUseCases.findAllOrdersWithProducts(
        mockOrderRepository, mockProductRepository
      );

      expect(result.orders).toEqual(orders);
      expect(result.products).toEqual(expectedProducts);
    });
  });
  describe("findOrdersByStatusWithProducts", () => {
    it("should return orders by status with products", async () => {
      const order = new Order(uuidv4(), uuidv4());
      const orderItem = new OrderItem(uuidv4(), 2, 15.99, order.id);
      order.addItem([orderItem]);
      
      const orders = [order];
      const product = new Product(orderItem.productId, "Burger", "Delicious burger", 15.99, uuidv4());
      const expectedProducts = new Map([[orderItem.productId, product]]);

      mockOrderRepository.findByStatus.mockResolvedValue(orders);
      mockProductRepository.findById.mockResolvedValue(product);

      const result = await OrderUseCases.findOrdersByStatusWithProducts(
        "PREPARING", mockOrderRepository, mockProductRepository
      );

      expect(result.orders).toEqual(orders);
      expect(result.products).toEqual(expectedProducts);
    });
  });
  describe("listSortedOrdersWithProducts", () => {
    it("should return sorted orders with products", async () => {
      const order = new Order(uuidv4(), uuidv4());
      const orderItem = new OrderItem(uuidv4(), 2, 15.99, order.id);
      order.addItem([orderItem]);
      
      const orders = [order];
      const product = new Product(orderItem.productId, "Burger", "Delicious burger", 15.99, uuidv4());
      const expectedProducts = new Map([[orderItem.productId, product]]);

      mockOrderRepository.findAllSorted.mockResolvedValue(orders);
      mockProductRepository.findById.mockResolvedValue(product);

      const result = await OrderUseCases.listSortedOrdersWithProducts(
        mockOrderRepository, mockProductRepository
      );

      expect(result.orders).toEqual(orders);
      expect(result.products).toEqual(expectedProducts);
    });
  });
  describe("Edge cases and error handling", () => {    
    it("should handle createOrder with insufficient stock", async () => {
      const customer = new Customer(uuidv4(), "John Doe", "john@test.com", "11144477735");
      const product = new Product(uuidv4(), "Burger", "Delicious burger", 15.99, uuidv4(), undefined, true, 1);
      const orderItems = [new OrderItem(product.id, 5, 15.99, uuidv4())]; // Requesting more than available

      mockCustomerRepository.findById.mockResolvedValue(customer);
      mockOrderRepository.create.mockResolvedValue(new Order(uuidv4(), customer.id));
      mockProductRepository.findById.mockResolvedValue(product);

      await expect(
        OrderUseCases.createOrder(orderItems, mockOrderRepository, mockProductRepository, customer.id, mockCustomerRepository)
      ).rejects.toThrow("Insufficient stock for product Burger");
    });

    it("should handle createOrder with customer not found", async () => {
      const orderItems = [new OrderItem(uuidv4(), 1, 15.99, uuidv4())];

      mockCustomerRepository.findById.mockResolvedValue(null);

      await expect(
        OrderUseCases.createOrder(orderItems, mockOrderRepository, mockProductRepository, uuidv4(), mockCustomerRepository)
      ).rejects.toThrow("Customer not found");
    });    

    it("should handle createOrder without customer", async () => {
      const product = new Product(uuidv4(), "Burger", "Delicious burger", 15.99, uuidv4(), undefined, true, 10);
      const orderItems = [new OrderItem(product.id, 2, 15.99, uuidv4())];
      const createdOrder = new Order();

      mockOrderRepository.create.mockResolvedValue(createdOrder);
      mockProductRepository.findById.mockResolvedValue(product);
      mockProductRepository.updateStock.mockResolvedValue(undefined);
      mockOrderRepository.update.mockResolvedValue(createdOrder);

      const result = await OrderUseCases.createOrder(orderItems, mockOrderRepository, mockProductRepository);

      expect(result).toEqual(createdOrder);
      expect(mockProductRepository.updateStock).toHaveBeenCalledWith(product.id, 8); // 10 - 2
    });
  });
});
