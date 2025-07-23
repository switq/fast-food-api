
import Order, { OrderStatus } from "@src/domain/entities/Order";
import OrderItem from "@src/domain/entities/OrderItem";
import { IOrderRepository } from "@src/application/repositories/IOrderRepository";
import { IProductRepository } from "@src/application/repositories/IProductRepository";
import { ICustomerRepository } from "@src/application/repositories/ICustomerRepository";
import { UUIDService } from "@src/domain/services/UUIDService";

export type OrderUseCaseDeps = {
  orderRepository: IOrderRepository;
  productRepository: IProductRepository;
  uuidService: UUIDService;
  customerRepository?: ICustomerRepository;
};

export type CreateOrderInput = {
  items: OrderItem[];
  customerId?: string;
};
export type FindOrderByIdInput = { id: string };
export type FindOrdersByCustomerInput = { customerId: string };
export type UpdateOrderStatusInput = { id: string; status: OrderStatus };
export type AddItemsToOrderInput = { id: string; items: OrderItem[] };
export type UpdateItemQuantityInput = { orderId: string; itemId: string; quantity: number };
export type DeleteOrderInput = { id: string };

export const createOrder = ({ orderRepository, productRepository, uuidService, customerRepository }: OrderUseCaseDeps) =>
  async ({ items, customerId }: CreateOrderInput): Promise<Order> => {
    if (customerId && customerRepository) {
      const customer = await customerRepository.findById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }
    }
    const order = Order.create(customerId, uuidService);
    const createdOrder = await orderRepository.create(order);
    for (const orderItem of items) {
      const product = await productRepository.findById(orderItem.productId);
      if (!product) {
        throw new Error(`Product with ID ${orderItem.productId} not found`);
      }
      if (!product.isAvailable) {
        throw new Error(`Product ${product.name} is not available`);
      }
    }
    createdOrder.addItem(items);
    return orderRepository.update(createdOrder);
  };

export const findOrderById = ({ orderRepository }: OrderUseCaseDeps) =>
  async ({ id }: FindOrderByIdInput): Promise<Order> => {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  };

export const findOrdersByCustomer = ({ orderRepository }: OrderUseCaseDeps) =>
  async ({ customerId }: FindOrdersByCustomerInput): Promise<Order[]> => {
    return orderRepository.findByCustomerId(customerId);
  };

export const findAllOrders = ({ orderRepository }: OrderUseCaseDeps) =>
  async (): Promise<Order[]> => {
    return orderRepository.findAll();
  };

export const updateOrderStatus = ({ orderRepository }: OrderUseCaseDeps) =>
  async ({ id, status }: UpdateOrderStatusInput): Promise<Order> => {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
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
    return orderRepository.update(order);
  };

export const addItemsToOrder = ({ orderRepository, productRepository }: OrderUseCaseDeps) =>
  async ({ id, items }: AddItemsToOrderInput): Promise<Order> => {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Cannot add items to an order that is not pending");
    }
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
  };

export const updateItemQuantity = ({ orderRepository }: OrderUseCaseDeps) =>
  async ({ orderId, itemId, quantity }: UpdateItemQuantityInput): Promise<Order> => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.updateItemQuantity(itemId, quantity);
    return orderRepository.update(order);
  };

export const deleteOrder = ({ orderRepository }: OrderUseCaseDeps) =>
  async ({ id }: DeleteOrderInput): Promise<void> => {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Cannot delete an order that is not pending");
    }
    await orderRepository.delete(id);
  };
