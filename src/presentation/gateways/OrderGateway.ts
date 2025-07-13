import { IDatabaseConnection } from "../../interfaces/IDbConnection";
import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";
import Order, { OrderStatus } from "../../domain/entities/Order";
import OrderItem from "../../domain/entities/OrderItem";

interface OrderData {
  id: string;
  customerId?: string;
  status: OrderStatus;
  totalAmount: number;
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
  private readonly orderTable: string = "order";
  private readonly orderItemTable: string = "orderItem";

  constructor(dbConnection: IDatabaseConnection) {
    this.dbConnection = dbConnection;
  }

  private async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const items = await this.dbConnection.findByField<OrderItemData>(
      this.orderItemTable,
      "orderId",
      orderId
    );
    return items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.orderId,
          item.productId,
          item.quantity,
          item.unitPrice,
          item.observation
        )
    );
  }

  async create(order: Order): Promise<Order> {
    const orderData = order.toJSON();
    const createdOrder = await this.dbConnection.create<Omit<OrderData, "id">>(
      this.orderTable,
      {
        customerId: orderData.customerId,
        status: orderData.status,
        totalAmount: orderData.totalAmount,
        createdAt: orderData.createdAt,
        updatedAt: orderData.updatedAt,
      }
    );
    // Salvar os itens
    for (const item of order.items) {
      const itemData = item.toJSON();
      await this.dbConnection.create<Omit<OrderItemData, "id">>(
        this.orderItemTable,
        {
          orderId: itemData.orderId,
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
    const items = await this.getOrderItems(orderData.id);
    return new Order(
      orderData.id,
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
        updatedAt: new Date(),
      }
    );
    // Atualizar itens: estratégia simples (deleta todos e recria)
    const existingItems = await this.getOrderItems(order.id);
    for (const item of existingItems) {
      await this.dbConnection.delete(this.orderItemTable, item.id);
    }
    for (const item of order.items) {
      const itemData = item.toJSON();
      await this.dbConnection.create<Omit<OrderItemData, "id">>(
        this.orderItemTable,
        {
          orderId: itemData.orderId,
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
    return new Order(order.id, order.customerId, items, order.status);
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
