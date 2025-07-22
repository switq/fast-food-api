import { IDatabaseConnection } from "../../interfaces/IDbConnection";
import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";
import Order, { OrderStatus } from "../../domain/entities/Order";
import OrderItem from "../../domain/entities/OrderItem";

interface OrderData {
  id: string;
  customerId?: string;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: number;
  paymentProviderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItemData {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderGateway implements IOrderRepository {
  private readonly dbConnection: IDatabaseConnection;
  private readonly orderTable: string = "order"; // Prisma client expects lowercase model name
  private readonly orderItemTable: string = "orderItem"; // Prisma client expects lowercase model name

  constructor(dbConnection: IDatabaseConnection) {
    this.dbConnection = dbConnection;
  }  private async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const items = await this.dbConnection.findByField<OrderItemData>(
      this.orderItemTable,
      "orderId",
      orderId
    );
    return items.map(
      (item) =>
        new OrderItem(
          item.productId,
          item.quantity,
          item.unitPrice,
          item.orderId || orderId,
          item.id,
          item.observation
        )
    );
  }
  async create(order: Order): Promise<Order> {
    const orderData = order.toJSON();
    console.log("OrderGateway.create payload:", orderData);
    const createdOrder = await this.dbConnection.create<Omit<OrderData, "id">>(
      this.orderTable,
      {
        customerId: orderData.customerId,
        status: orderData.status,
        totalAmount: orderData.totalAmount,
        paymentStatus: orderData.paymentStatus,
        paymentProviderId: orderData.paymentProviderId,
        createdAt: orderData.createdAt,
        updatedAt: orderData.updatedAt,
      }
    );
    console.log("OrderGateway.create result:", createdOrder);
    // Salvar os itens usando o ID do pedido criado
    for (const item of order.items) {
      const itemData = item.toJSON();
      await this.dbConnection.create<Omit<OrderItemData, "id">>(
        this.orderItemTable,
        {
          orderId: (createdOrder as any).id, // Use the ID from the created order
          productId: itemData.productId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalPrice: itemData.totalPrice,
          observation: itemData.observation,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    }
    const items = await this.getOrderItems((createdOrder as any).id);
    return new Order(
      (createdOrder as any).id,
      orderData.customerId,
      items,
      orderData.status
    );
  }

  async update(order: Order): Promise<Order> {
    const orderData = order.toJSON();
    const updatedOrder = await this.dbConnection.update<OrderData>(
      this.orderTable,
      order.id,
      {
        customerId: orderData.customerId,
        status: orderData.status,
        totalAmount: orderData.totalAmount,
        paymentStatus: orderData.paymentStatus,
        paymentProviderId: orderData.paymentProviderId,
        updatedAt: new Date(),
      }
    );
    // Atualizar itens: estratégia simples (deleta todos e recria)
    const existingItems = await this.getOrderItems(order.id);
    for (const item of existingItems) {
      await this.dbConnection.delete(this.orderItemTable, item.id);
    }    for (const item of order.items) {
      const itemData = item.toJSON();
      await this.dbConnection.create<Omit<OrderItemData, "id">>(
        this.orderItemTable,
        {
          orderId: itemData.orderId || order.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
          totalPrice: itemData.totalPrice,
          observation: itemData.observation,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    }
    const items = await this.getOrderItems(order.id);
    return new Order(
      updatedOrder.id,
      updatedOrder.customerId,
      items,
      updatedOrder.status
    );
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.dbConnection.findById<OrderData>(
      this.orderTable,
      id
    );
    if (!order) {
      return null;
    }
    const items = await this.getOrderItems(order.id);
    return new Order(order.id, order.customerId, items, order.status, order.paymentStatus, order.paymentProviderId);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.dbConnection.findAll<OrderData>(this.orderTable);
    const result: Order[] = [];
    for (const order of orders) {
      const items = await this.getOrderItems(order.id);
      result.push(new Order(order.id, order.customerId, items, order.status));
    }
    return result;
  }

  async findAllSorted(): Promise<Order[]> {
    const allOrders = await this.findAll();

    const kitchenStatuses = [
      OrderStatus.PAYMENT_CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.READY,
    ];

    const filteredOrders = allOrders.filter((order) =>
      kitchenStatuses.includes(order.status)
    );

    const statusOrder: { [key: string]: number } = {
      [OrderStatus.READY]: 1,
      [OrderStatus.PREPARING]: 2,
      [OrderStatus.PAYMENT_CONFIRMED]: 3,
    };

    const sortedOrders = filteredOrders.sort((a, b) => {
      const statusA = statusOrder[a.status] || 4;
      const statusB = statusOrder[b.status] || 4;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return sortedOrders;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const orders = await this.dbConnection.findByField<OrderData>(
      this.orderTable,
      "customerId",
      customerId
    );
    const result: Order[] = [];
    for (const order of orders) {
      const items = await this.getOrderItems(order.id);
      result.push(new Order(order.id, order.customerId, items, order.status));
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    // Deleta os itens primeiro
    const items = await this.getOrderItems(id);
    for (const item of items) {
      await this.dbConnection.delete(this.orderItemTable, item.id);
    }
    const deleted = await this.dbConnection.delete(this.orderTable, id);
    if (!deleted) {
      throw new Error(`Order with ID ${id} not found`);
    }
  }
}
