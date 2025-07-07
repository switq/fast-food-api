import Customer from "@entities/Customer";
import { DbConnection } from "@src/interfaces/dbconnection";
import { CustomerGatewayInterface } from "@interfaces/gateway";
import { DbParam } from "../types/DbParam";

export class CustomerGateway implements CustomerGatewayInterface {
  private readonly dataRepository: DbConnection;
  private readonly tableName = "customers";

  constructor(connection: DbConnection) {
    this.dataRepository = connection;
  }

  public async create(customer: Customer): Promise<Customer> {
    const params: DbParam[] = [
      { field: "id", value: customer.id },
      { field: "name", value: customer.name },
      { field: "email", value: customer.email },
      { field: "cpf", value: customer.cpf },
      { field: "phone", value: customer.phone },
    ];
    await this.dataRepository.insert(this.tableName, params);
    return customer;
  }

  public async findById(id: string): Promise<Customer | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "id", value: id }]
    );
    if (!result || result.length < 1) return null;
    const row = result[0];
    return new Customer(row.id, row.name, row.email, row.cpf, row.phone);
  }

  public async findByName(name: string): Promise<Customer | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "name", value: name }]
    );
    if (!result || result.length < 1) return null;
    const row = result[0];
    return new Customer(row.id, row.name, row.email, row.cpf, row.phone);
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "email", value: email }]
    );
    if (!result || result.length < 1) return null;
    const row = result[0];
    return new Customer(row.id, row.name, row.email, row.cpf, row.phone);
  }

  public async findByCPF(cpf: string): Promise<Customer | null> {
    const result = await this.dataRepository.findByParams(
      this.tableName,
      null,
      [{ field: "cpf", value: cpf }]
    );
    if (!result || result.length < 1) return null;
    const row = result[0];
    return new Customer(row.id, row.name, row.email, row.cpf, row.phone);
  }

  public async findAll(): Promise<Customer[]> {
    const result = await this.dataRepository.findAll(this.tableName, null);
    if (!result) return [];
    return result.map((row: any) => new Customer(row.id, row.name, row.email, row.cpf, row.phone));
  }

  public async update(customer: Customer): Promise<Customer> {
    const params: DbParam[] = [
      { field: "name", value: customer.name },
      { field: "email", value: customer.email },
      { field: "cpf", value: customer.cpf },
      { field: "phone", value: customer.phone },
    ];
    await this.dataRepository.update(this.tableName, customer.id, params);
    return customer;
  }

  public async delete(id: string): Promise<void> {
    await this.dataRepository.delete(this.tableName, id);
  }

  // Métodos do gateway para compatibilidade
  public async add(customer: Customer): Promise<Customer> {
    return this.create(customer);
  }

  public async remove(id: string): Promise<void> {
    await this.delete(id);
  }
}
