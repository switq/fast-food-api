import { UUIDService } from "../services/UUIDService";
import { BaseEntity } from "./BaseEntity";
import OrderItem from "./OrderItem";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

class Order implements BaseEntity {
  private _id: string;
  private _customerId?: string;
  private _items: OrderItem[];
  private _status: OrderStatus;
  private _totalAmount: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    customerId: string | undefined,
    items: OrderItem[],
    status: OrderStatus = OrderStatus.PENDING,
    uuidService?: UUIDService,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateId(id, uuidService);
    if (customerId) {
      this.validateCustomerId(customerId, uuidService);
    }
    this.validateItemsArray(items);
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._status = status;
    this._totalAmount = this.calculateTotalAmount();
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create(
    customerId: string | undefined,
    items: OrderItem[],
    uuidService: UUIDService
  ): Order {
    const now = new Date();
    return new Order(
      uuidService.generate(),
      customerId,
      items,
      OrderStatus.PENDING,
      uuidService,
      now,
      now
    );
  }

  private validateId(id: string, uuidService?: UUIDService): void {
    if (!id || id.trim().length === 0) {
      throw new Error("Order ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(id)) {
        throw new Error("Order ID must be a valid UUID");
      }
    }
  }

  private validateCustomerId(customerId: string, uuidService?: UUIDService): void {
    if (!customerId || customerId.trim().length === 0) {
      throw new Error("Customer ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(customerId)) {
        throw new Error("Customer ID must be a valid UUID");
      }
    }
  }

  private validateItemsArray(items: OrderItem[]): void {
    if (!Array.isArray(items)) {
      throw new Error("Items must be an array");
    }
  }

  private validateItems(items: OrderItem[]): void {
    if (!Array.isArray(items)) {
      throw new Error("Items must be an array");
    }
    if (items.length === 0) {
      throw new Error("Order must have at least one item");
    }
  }

  private calculateTotalAmount(): number {
    return this._items.reduce((total, item) => total + item.totalPrice, 0);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get customerId(): string | undefined {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return [...this._items]; // Return a copy to prevent direct modification
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Status transition methods
  confirm(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error("Order can only be confirmed when in PENDING status");
    }

    // Validate that order has at least one item before confirming
    this.validateItems(this._items);

    this._status = OrderStatus.CONFIRMED;
    this._updatedAt = new Date();
  }

  confirmPayment(): void {
    if (this._status !== OrderStatus.CONFIRMED) {
      throw new Error(
        "Payment can only be confirmed when order is in CONFIRMED status"
      );
    }
    this._status = OrderStatus.PAYMENT_CONFIRMED;
    this._updatedAt = new Date();
  }

  startPreparing(): void {
    if (this._status !== OrderStatus.PAYMENT_CONFIRMED) {
      throw new Error(
        "Order can only start preparing when payment is confirmed"
      );
    }
    this._status = OrderStatus.PREPARING;
    this._updatedAt = new Date();
  }

  markAsReady(): void {
    if (this._status !== OrderStatus.PREPARING) {
      throw new Error(
        "Order can only be marked as ready when it is being prepared"
      );
    }
    this._status = OrderStatus.READY;
    this._updatedAt = new Date();
  }

  markAsDelivered(): void {
    if (this._status !== OrderStatus.READY) {
      throw new Error("Order can only be marked as delivered when it is ready");
    }
    this._status = OrderStatus.DELIVERED;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this._status === OrderStatus.DELIVERED) {
      throw new Error("Cannot cancel an order that has been delivered");
    }
    if (this._status === OrderStatus.CANCELLED) {
      throw new Error("Order is already cancelled");
    }
    this._status = OrderStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  // Methods to manage items
  addItem(items: OrderItem | OrderItem[]): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error("Cannot add items to an order that is not pending");
    }

    const itemsToAdd = Array.isArray(items) ? items : [items];

    if (itemsToAdd.length === 0) {
      throw new Error("Cannot add empty list of items");
    }

    this._items.push(...itemsToAdd);
    this._totalAmount = this.calculateTotalAmount();
    this._updatedAt = new Date();
  }

  removeItem(itemIds: string | string[]): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error("Cannot remove items from an order that is not pending");
    }

    const idsToRemove = Array.isArray(itemIds) ? itemIds : [itemIds];

    if (idsToRemove.length === 0) {
      throw new Error("Cannot remove empty list of items");
    }

    const initialLength = this._items.length;
    this._items = this._items.filter((item) => !idsToRemove.includes(item.id));

    if (this._items.length === initialLength) {
      throw new Error("No items found to remove");
    }

    this._totalAmount = this.calculateTotalAmount();
    this._updatedAt = new Date();
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error("Cannot update items in an order that is not pending");
    }

    const item = this._items.find((item) => item.id === itemId);
    if (!item) {
      throw new Error("Item not found in order");
    }

    item.quantity = quantity;
    this._totalAmount = this.calculateTotalAmount();
    this._updatedAt = new Date();
  }

  // Remove toJSON method for clean architecture
}

export default Order;
