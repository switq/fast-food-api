import Category from "@entities/Category";
import Customer from "@entities/Customer";
import Product from "@entities/Product";
import Order from "@entities/Order";

export interface CategoryGatewayInterface {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  add(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  remove(id: string): Promise<void>;
}

export interface CustomerGatewayInterface {
  findById(id: string): Promise<Customer | null>;
  findByName(name: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  add(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  remove(id: string): Promise<void>;
}

export interface ProductGatewayInterface {
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  add(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  remove(id: string): Promise<void>;
}

export interface OrderGatewayInterface {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  add(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  remove(id: string): Promise<void>;
  findByCustomerId(customerId: string): Promise<Order[]>;
}
