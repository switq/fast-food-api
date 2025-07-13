import PaymentUseCases from "../../../src/application/use-cases/PaymentUseCases";
import Order, { OrderStatus } from "../../../src/domain/entities/Order";
import OrderItem from "../../../src/domain/entities/OrderItem";
import { IOrderRepository } from "../../../src/interfaces/repositories/IOrderRepository";
import {
  IPaymentGateway,
  PaymentStatus,
} from "../../../src/application/gateways/IPaymentGateway";

describe("PaymentUseCases", () => {
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let mockPaymentGateway: jest.Mocked<IPaymentGateway>;

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

    mockPaymentGateway = {
      createPayment: jest.fn(),
      getPaymentStatus: jest.fn(),
    };
  });

  describe("handleWebhookNotification", () => {
    it("should update order status when payment is approved", async () => {
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440001",
        "550e8400-e29b-41d4-a716-446655440011",
        [
          new OrderItem(
            "550e8400-e29b-41d4-a716-446655440021",
            "550e8400-e29b-41d4-a716-446655440001",
            "550e8400-e29b-41d4-a716-446655440031",
            1,
            10,
            "test"
          ),
        ]
      );
      order.confirm(); // The order must be confirmed before payment can be confirmed
      mockPaymentGateway.getPaymentStatus.mockResolvedValue({
        status: PaymentStatus.APPROVED,
        externalReference: "550e8400-e29b-41d4-a716-446655440001",
      });
      mockOrderRepository.findById.mockResolvedValue(order);

      await PaymentUseCases.handleWebhookNotification(
        "payment-1",
        mockOrderRepository,
        mockPaymentGateway
      );

      expect(order.paymentStatus).toBe(PaymentStatus.APPROVED);
      expect(order.status).toBe(OrderStatus.PAYMENT_CONFIRMED);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });

    it("should not update order status when payment is not approved", async () => {
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440001",
        "550e8400-e29b-41d4-a716-446655440011"
      );
      mockPaymentGateway.getPaymentStatus.mockResolvedValue({
        status: PaymentStatus.REJECTED,
        externalReference: "550e8400-e29b-41d4-a716-446655440001",
      });
      mockOrderRepository.findById.mockResolvedValue(order);

      await PaymentUseCases.handleWebhookNotification(
        "payment-1",
        mockOrderRepository,
        mockPaymentGateway
      );

      expect(order.paymentStatus).toBe(PaymentStatus.REJECTED);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    });
  });

  describe("getPaymentStatus", () => {
    it("should return payment status of an order", async () => {
      const order = new Order(
        "550e8400-e29b-41d4-a716-446655440001",
        "550e8400-e29b-41d4-a716-446655440011",
        [],
        undefined,
        "approved"
      );
      mockOrderRepository.findById.mockResolvedValue(order);

      const result = await PaymentUseCases.getPaymentStatus(
        "550e8400-e29b-41d4-a716-446655440001",
        mockOrderRepository
      );

      expect(result).toBe("approved");
    });
  });
});
