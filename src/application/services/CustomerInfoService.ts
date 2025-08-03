import Order from "../../domain/entities/Order";
import Customer from "../../domain/entities/Customer";
import { ICustomerRepository } from "../../interfaces/repositories/ICustomerRepository";

export default class CustomerInfoService {
  static async getCustomersFromOrders(
    orders: Order[],
    customerGateway: ICustomerRepository
  ): Promise<Map<string, Customer>> {
    const customerIds = new Set<string>();
    orders.forEach(order => {
      if (order.customerId) {
        customerIds.add(order.customerId);
      }
    });

    const customers = new Map<string, Customer>();
    
    for (const customerId of customerIds) {
      try {
        const customer = await customerGateway.findById(customerId);
        if (customer) {
          customers.set(customerId, customer);
        }
      } catch (error) {
        console.warn(`Could not fetch customer ${customerId}:`, error);
      }
    }

    return customers;
  }

  static async getCustomerFromOrder(
    order: Order,
    customerGateway: ICustomerRepository
  ): Promise<Map<string, Customer>> {
    return this.getCustomersFromOrders([order], customerGateway);
  }
}
