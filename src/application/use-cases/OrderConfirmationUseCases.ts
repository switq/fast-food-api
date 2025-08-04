import Order from "../../domain/entities/Order";
import { IOrderRepository } from "../../interfaces/repositories/IOrderRepository";
import { ICustomerRepository } from "../../interfaces/repositories/ICustomerRepository";
import Customer from "../../domain/entities/Customer";

class OrderConfirmationUseCases {
  static async confirmOrderSimple(
    id: string,
    orderRepository: IOrderRepository,
    customerRepository: ICustomerRepository
  ): Promise<{ order: Order; customer?: Customer }> {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Confirm the order (this will generate the orderNumber)
    order.confirm();
    
    // Update the order in repository
    const updatedOrder = await orderRepository.update(order);
    
    // Get customer info if exists
    let customer: Customer | undefined;
    if (order.customerId) {
      customer = await customerRepository.findById(order.customerId) || undefined;
    }

    return { order: updatedOrder, customer };
  }
}

export default OrderConfirmationUseCases;
