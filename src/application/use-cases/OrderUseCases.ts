import Order, { OrderStatus } from "@entities/Order";
import OrderItem from "@entities/OrderItem";
import { IOrderRepository } from "@interfaces/repositories/IOrderRepository";
import { IProductRepository } from "@interfaces/repositories/IProductRepository";
import { ICustomerRepository } from "@interfaces/repositories/ICustomerRepository";

class OrderUseCases {
  static async createOrder(
    items: OrderItem[],
    orderRepository: IOrderRepository,
    productRepository: IProductRepository,
    customerId?: string,
    customerRepository?: ICustomerRepository
  ): Promise<Order> {
    // Se customerId for informado, valida se existe
    if (customerId && customerRepository) {
      const customer = await customerRepository.findById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }
    }
    // Cria o pedido já com os itens e customerId opcional
    const order = new Order(undefined, customerId);
    const createdOrder = await orderRepository.create(order);

    // Validate products for each order item and check stock
    for (const orderItem of items) {
      const product = await productRepository.findById(orderItem.productId);
      if (!product) {
        throw new Error(`Product with ID ${orderItem.productId} not found`);
      }
      if (!product.isAvailable) {
        throw new Error(`Product ${product.name} is not available`);
      }
      if (product.stock < orderItem.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
    }

    // Decrease stock for each product
    for (const orderItem of items) {
      const product = await productRepository.findById(orderItem.productId);
      if (product) {
        await productRepository.updateStock(
          product.id,
          product.stock - orderItem.quantity
        );
      }
    }

    // Add items to the order
    createdOrder.addItem(items);
    return orderRepository.update(createdOrder);
  }

  static async findOrderById(
    id: string,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  static async findOrdersByCustomer(
    customerId: string,
    repository: IOrderRepository
  ): Promise<Order[]> {
    return repository.findByCustomerId(customerId);
  }

  static async findAllOrders(repository: IOrderRepository): Promise<Order[]> {
    return repository.findAll();
  }

  static async findOrdersByStatus(
    status: string,
    repository: IOrderRepository
  ): Promise<Order[]> {
    return repository.findByStatus(status);
  }

  static async listSortedOrders(
    repository: IOrderRepository
  ): Promise<Order[]> {
    return repository.findAllSorted();
  }

  static async updateOrderStatus(
    id: string,
    status: OrderStatus,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
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

    return repository.update(order);
  }

  static async addItemsToOrder(
    id: string,
    items: OrderItem[],
    orderRepository: IOrderRepository,
    productRepository: IProductRepository
  ): Promise<Order> {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Cannot add items to an order that is not pending");
    }

    // Validate products for each order item
    for (const orderItem of items) {
      const product = await productRepository.findById(orderItem.productId);
      if (!product) {
        throw new Error(`Product with ID ${orderItem.productId} not found`);
      }
      if (!product.isAvailable) {
        throw new Error(`Product ${product.name} is not available`);
      }
    }

    order.addItem(items);
    return orderRepository.update(order);
  }

  static async updateItemQuantity(
    orderId: string,
    itemId: string,
    quantity: number,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.updateItemQuantity(itemId, quantity);
    return repository.update(order);
  }

  static async deleteOrder(
    id: string,
    repository: IOrderRepository
  ): Promise<void> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Cannot delete an order that is not pending");
    }

    await repository.delete(id);
  }

  static async confirmOrder(
    id: string,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.confirm();
    return repository.update(order);
  }

  static async confirmPayment(
    id: string,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.confirmPayment();
    return repository.update(order);
  }

  static async startPreparingOrder(
    id: string,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.startPreparing();
    return repository.update(order);
  }

  static async markOrderAsReady(
    id: string,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.markAsReady();
    return repository.update(order);
  }

  static async markOrderAsDelivered(
    id: string,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.markAsDelivered();
    return repository.update(order);
  }

  static async cancelOrder(
    id: string,
    repository: IOrderRepository
  ): Promise<Order> {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.cancel();
    return repository.update(order);
  }
}

export default OrderUseCases;
