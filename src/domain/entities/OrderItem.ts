import { UUIDService } from "@src/domain/services/UUIDService";
import { BaseEntity } from "./BaseEntity";

class OrderItem implements BaseEntity {
  private _id: string;
  private _orderId: string;
  private _productId: string;
  private _quantity: number;
  private _unitPrice: number;
  private _totalPrice: number;
  private _observation?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    observation?: string,
    uuidService?: UUIDService,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateId(id, uuidService);
    this.validateOrderId(orderId, uuidService);
    this.validateProductId(productId, uuidService);
    this.validateQuantity(quantity);
    this.validateUnitPrice(unitPrice);
    if (observation) {
      this.validateObservation(observation);
    }
    this._id = id;
    this._orderId = orderId;
    this._productId = productId;
    this._quantity = quantity;
    this._unitPrice = unitPrice;
    this._totalPrice = this.calculateTotalPrice();
    this._observation = observation;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create(
    orderId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    observation: string | undefined,
    uuidService: UUIDService
  ): OrderItem {
    const now = new Date();
    return new OrderItem(
      uuidService.generate(),
      orderId,
      productId,
      quantity,
      unitPrice,
      observation,
      uuidService,
      now,
      now
    );
  }

  private validateId(id: string, uuidService?: UUIDService): void {
    if (!id || id.trim().length === 0) {
      throw new Error("OrderItem ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(id)) {
        throw new Error("OrderItem ID must be a valid UUID");
      }
    }
  }

  private validateOrderId(orderId: string, uuidService?: UUIDService): void {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error("Order ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(orderId)) {
        throw new Error("Order ID must be a valid UUID");
      }
    }
  }

  private validateProductId(productId: string, uuidService?: UUIDService): void {
    if (!productId || productId.trim().length === 0) {
      throw new Error("Product ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(productId)) {
        throw new Error("Product ID must be a valid UUID");
      }
    }
  }

  private validateQuantity(quantity: number): void {
    if (quantity === undefined || quantity === null) {
      throw new Error("Quantity cannot be empty");
    }
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    if (!Number.isInteger(quantity)) {
      throw new Error("Quantity must be an integer");
    }
  }

  private validateUnitPrice(unitPrice: number): void {
    if (unitPrice === undefined || unitPrice === null) {
      throw new Error("Unit price cannot be empty");
    }
    if (unitPrice < 0) {
      throw new Error("Unit price cannot be negative");
    }
  }

  private validateObservation(observation: string): void {
    if (observation.length > 255) {
      throw new Error("Observation cannot exceed 255 characters");
    }
  }

  private calculateTotalPrice(): number {
    return this._quantity * this._unitPrice;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get orderId(): string {
    return this._orderId;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get observation(): string | undefined {
    return this._observation;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  set quantity(quantity: number) {
    this.validateQuantity(quantity);
    this._quantity = quantity;
    this._totalPrice = this.calculateTotalPrice();
  }

  set unitPrice(unitPrice: number) {
    this.validateUnitPrice(unitPrice);
    this._unitPrice = unitPrice;
    this._totalPrice = this.calculateTotalPrice();
  }

  set observation(observation: string | undefined) {
    if (observation) {
      this.validateObservation(observation);
    }
    this._observation = observation;
  }

  // Note: No setters for id, orderId, and productId as they should be immutable after creation

  // Remove toJSON method for clean architecture
}

export default OrderItem;
