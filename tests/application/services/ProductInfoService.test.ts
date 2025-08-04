import ProductInfoService from "../../../src/application/services/ProductInfoService";
import Order from "../../../src/domain/entities/Order";
import Product from "../../../src/domain/entities/Product";
import { IProductRepository } from "../../../src/interfaces/repositories/IProductRepository";
import OrderItem from "../../../src/domain/entities/OrderItem";
import Category from "../../../src/domain/entities/Category";
import { v4 as uuidv4 } from "uuid";

describe("ProductInfoService", () => {
  let mockProductRepository: jest.Mocked<IProductRepository>;
  let testProduct1: Product;
  let testProduct2: Product;
  let testOrder: Order;
  
  beforeEach(() => {
    mockProductRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findByCategory: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateStock: jest.fn(),
    };    const categoryId = uuidv4();
    const category = new Category(categoryId, "Burgers", "Burger category");    testProduct1 = new Product(uuidv4(), "Burger", "Delicious burger", 15.99, category.id, "https://example.com/image1.jpg", true);
    testProduct2 = new Product(uuidv4(), "Fries", "Crispy fries", 5.99, category.id, "https://example.com/image2.jpg", true);    const orderId = uuidv4();
    const customerId = uuidv4();
    const orderItem1 = new OrderItem(testProduct1.id, 2, 15.99, orderId, uuidv4(), "No onions");
    const orderItem2 = new OrderItem(testProduct2.id, 1, 5.99, orderId, uuidv4(), "Extra salt");

    testOrder = new Order(orderId, customerId);
    testOrder.addItem(orderItem1);
    testOrder.addItem(orderItem2);
  });  describe("getProductsFromOrders", () => {
    it("should return a map of products from multiple orders", async () => {      // Arrange
      const orderId2 = uuidv4();
      const customerId2 = uuidv4();
      const order2 = new Order(orderId2, customerId2);
      order2.addItem(new OrderItem(testProduct1.id, 1, 15.99, orderId2, uuidv4()));
      const orders = [testOrder, order2];

      mockProductRepository.findById
        .mockResolvedValueOnce(testProduct1)
        .mockResolvedValueOnce(testProduct2);

      // Act
      const result = await ProductInfoService.getProductsFromOrders(orders, mockProductRepository);

      // Assert
      expect(result.size).toBe(2);
      expect(result.get(testProduct1.id)).toEqual(testProduct1);
      expect(result.get(testProduct2.id)).toEqual(testProduct2);
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(testProduct1.id);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(testProduct2.id);
    });

    it("should handle empty orders array", async () => {
      // Arrange
      const orders: Order[] = [];

      // Act
      const result = await ProductInfoService.getProductsFromOrders(orders, mockProductRepository);

      // Assert
      expect(result.size).toBe(0);
      expect(mockProductRepository.findById).not.toHaveBeenCalled();
    });    it("should handle orders with no items", async () => {
      // Arrange      
      const emptyOrderId = uuidv4();
      const emptyOrder = new Order(emptyOrderId, uuidv4());
      const orders = [emptyOrder];

      // Act
      const result = await ProductInfoService.getProductsFromOrders(orders, mockProductRepository);

      // Assert
      expect(result.size).toBe(0);
      expect(mockProductRepository.findById).not.toHaveBeenCalled();
    });

    it("should handle product not found in repository", async () => {
      // Arrange
      const orders = [testOrder];
      mockProductRepository.findById
        .mockResolvedValueOnce(testProduct1)
        .mockResolvedValueOnce(null); // second product not found

      // Act
      const result = await ProductInfoService.getProductsFromOrders(orders, mockProductRepository);

      // Assert
      expect(result.size).toBe(1);
      expect(result.get(testProduct1.id)).toEqual(testProduct1);
      expect(result.get(testProduct2.id)).toBeUndefined();
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(2);
    });

    it("should deduplicate product IDs from multiple orders", async () => {      // Arrange
      const orderId2 = uuidv4();
      const customerId2 = uuidv4();
      const order2 = new Order(orderId2, customerId2, []);
      order2.addItem(new OrderItem(testProduct1.id, 3, 15.99, orderId2, uuidv4())); // Same product as order1
      const orders = [testOrder, order2];

      mockProductRepository.findById
        .mockResolvedValueOnce(testProduct1)
        .mockResolvedValueOnce(testProduct2);

      // Act
      const result = await ProductInfoService.getProductsFromOrders(orders, mockProductRepository);

      // Assert
      expect(result.size).toBe(2);
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(2); // Should only call once per unique product
    });
  });

  describe("getProductsFromOrder", () => {
    it("should return products from a single order", async () => {
      // Arrange
      mockProductRepository.findById
        .mockResolvedValueOnce(testProduct1)
        .mockResolvedValueOnce(testProduct2);

      // Act
      const result = await ProductInfoService.getProductsFromOrder(testOrder, mockProductRepository);

      // Assert
      expect(result.size).toBe(2);
      expect(result.get(testProduct1.id)).toEqual(testProduct1);
      expect(result.get(testProduct2.id)).toEqual(testProduct2);
    });    it("should handle empty order", async () => {
      // Arrange
      const emptyOrderId = uuidv4();
      const emptyCustomerId = uuidv4();
      const emptyOrder = new Order(emptyOrderId, emptyCustomerId, []);

      // Act
      const result = await ProductInfoService.getProductsFromOrder(emptyOrder, mockProductRepository);

      // Assert
      expect(result.size).toBe(0);
      expect(mockProductRepository.findById).not.toHaveBeenCalled();
    });
  });
});
