import { OrderGateway } from "../../../src/presentation/gateways/OrderGateway";
import { IDatabaseConnection } from "../../../src/interfaces/IDbConnection";
import Order, { OrderStatus } from "../../../src/domain/entities/Order";

describe("OrderGateway", () => {
  let dbConnection: IDatabaseConnection;
  let orderGateway: OrderGateway;

  beforeEach(() => {
    dbConnection = {
      findAll: jest.fn(),
      findByField: jest.fn(),
      // Mock other methods as needed
    } as any;
    orderGateway = new OrderGateway(dbConnection);
  });

  describe("findAllSorted", () => {
    it("should return orders sorted by status and creation date", async () => {
      const orders = [
        new Order(
          "550e8400-e29b-41d4-a716-446655440001",
          "550e8400-e29b-41d4-a716-446655440011",
          [],
          OrderStatus.DELIVERED
        ),
        new Order(
          "550e8400-e29b-41d4-a716-446655440002",
          "550e8400-e29b-41d4-a716-446655440012",
          [],
          OrderStatus.PREPARING,
          "approved"
        ),
        new Order(
          "550e8400-e29b-41d4-a716-446655440003",
          "550e8400-e29b-41d4-a716-446655440013",
          [],
          OrderStatus.READY,
          "approved"
        ),
        new Order(
          "550e8400-e29b-41d4-a716-446655440004",
          "550e8400-e29b-41d4-a716-446655440014",
          [],
          OrderStatus.PAYMENT_CONFIRMED,
          "approved"
        ),
        new Order(
          "550e8400-e29b-41d4-a716-446655440005",
          "550e8400-e29b-41d4-a716-446655440015",
          [],
          OrderStatus.PREPARING,
          "approved"
        ),
      ];
      (dbConnection.findAll as jest.Mock).mockResolvedValue(
        orders.map((o) => ({ ...o.toJSON(), paymentStatus: o.paymentStatus }))
      );
      (dbConnection.findByField as jest.Mock).mockResolvedValue([]);

      const sortedOrders = await orderGateway.findAllSorted();

      expect(sortedOrders.map((o) => o.id)).toEqual([
        "550e8400-e29b-41d4-a716-446655440003",
        "550e8400-e29b-41d4-a716-446655440002",
        "550e8400-e29b-41d4-a716-446655440005",
        "550e8400-e29b-41d4-a716-446655440004",
      ]);
      expect(dbConnection.findAll).toHaveBeenCalledWith("order");
    });
  });
});
