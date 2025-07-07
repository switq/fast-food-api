import Order from "@entities/Order";
import { DbConnection } from "@src/interfaces/dbconnection";
import { OrderGatewayInterface } from "@interfaces/gateway";
import { DbParam } from "../types/DbParam";

export class OrderGateway implements OrderGatewayInterface {
  private readonly dataRepository: DbConnection;
  private readonly tableName = "orders";

  constructor(connection: DbConnection) {
    this.dataRepository = connection;
  }

  public async findById(id: string): Promise<Order | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "id", value: id }]
    );
    if (!result || result.length < 1) return null;
    const row = result[0];
    return new Order(row.id, row.customerId, row.items, row.status);
  }

  public async findAll(): Promise<Order[]> {
    const result = await this.dataRepository.findAll(this.tableName, null);
    if (!result) return [];
    return result.map((row: any) => new Order(row.id, row.customerId, row.items, row.status));
  }

  public async create(order: Order): Promise<Order> {
    const params: DbParam[] = [
      { field: "id", value: order.id },
      { field: "customerId", value: order.customerId },
      { field: "status", value: order.status },
      // Adapte para incluir items se necessário
    ];
    await this.dataRepository.insert(this.tableName, params);
    return order;
  }

  public async update(order: Order): Promise<Order> {
    const params: DbParam[] = [
      { field: "customerId", value: order.customerId },
      { field: "status", value: order.status },
      // Adapte para incluir items se necessário
    ];
    await this.dataRepository.update(this.tableName, order.id, params);
    return order;
  }

  public async add(order: Order): Promise<Order> {
    return this.create(order);
  }

  public async delete(id: string): Promise<void> {
    await this.dataRepository.delete(this.tableName, id);
  }

  public async remove(id: string): Promise<void> {
    await this.delete(id);
  }

  public async findByCustomerId(customerId: string): Promise<Order[]> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "customerId", value: customerId }]
    );
    if (!result) return [];
    return result.map((row: any) => new Order(row.id, row.customerId, row.items, row.status));
  }
}
