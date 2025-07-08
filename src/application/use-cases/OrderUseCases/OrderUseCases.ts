import Order, { OrderStatus } from "../../../domain/entities/Order";
import OrderItem from "../../../domain/entities/OrderItem";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { IProductRepository } from "../../repositories/IProductRepository";
import { ICustomerRepository } from "../../repositories/ICustomerRepository";
import { UUIDService } from "../../../domain/services/UUIDService";

class OrderUseCases {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly uuidService: UUIDService,
    private readonly customerRepository?: ICustomerRepository
  ) {}

  async createOrder(
    items: OrderItem[],
    customerId?: string
  ): Promise<Order> {
    // Validate customer if provided
    if (customerId && this.customerRepository) {
      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }
    }

    // Create order using the static create method
    const order = Order.create(customerId, this.uuidService);
    const createdOrder = await this.orderRepository.create(order);

    // Validate products for each order item
    for (const orderItem of items) {
      const product = await this.productRepository.findById(orderItem.productId);
      if (!product) {
        throw new Error(`Product with ID ${orderItem.productId} not found`);
      }
      if (!product.isAvailable) {
        throw new Error(`Product ${product.name} is not available`);
      }
    }

    // Add items to the order
    createdOrder.addItem(items);
    return this.orderRepository.update(createdOrder);
  }

  async findOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async findOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerId(customerId);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Use the appropriate status transition method from Order entity
    switch (status) {
      case OrderStatus.CONFIRMED:
        order.confirm();
        break;
      case OrderStatus.PAYMENT_CONFIRMED:
        order.confirmPayment();
        break;
      case OrderStatus.PREPARING:
        order.startPreparing();
        break;
      case OrderStatus.READY:
        order.markAsReady();
        break;
      case OrderStatus.DELIVERED:
        order.markAsDelivered();
        break;
      case OrderStatus.CANCELLED:
        order.cancel();
        break;
      default:
        throw new Error(`Invalid status transition to ${status}`);
    }

    return this.orderRepository.update(order);
  }

  async addItemsToOrder(
    id: string,
    items: OrderItem[]
  ): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Cannot add items to an order that is not pending");
    }

    // Validate products for each order item
    for (const orderItem of items) {
      const product = await this.productRepository.findById(orderItem.productId);
      if (!product) {
        throw new Error(`Product with ID ${orderItem.productId} not found`);
      }
      if (!product.isAvailable) {
        throw new Error(`Product ${product.name} is not available`);
      }
    }

    order.addItem(items);
    return this.orderRepository.update(order);
  }

  async updateItemQuantity(
    orderId: string,
    itemId: string,
    quantity: number
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.updateItemQuantity(itemId, quantity);
    return this.orderRepository.update(order);
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Cannot delete an order that is not pending");
    }

    await this.orderRepository.delete(id);
  }
}

export default OrderUseCases;
