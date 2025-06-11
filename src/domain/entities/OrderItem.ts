import { v4 as uuidv4, validate as uuidValidate } from "uuid";

class OrderItem {
  private _id: string;
  private _orderId: string;
  private _productId: string;
  private _quantity: number;
  private _unitPrice: number;
  private _totalPrice: number;
  private _observation?: string;

  constructor(
    id: string = uuidv4(),
    orderId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    observation?: string
  ) {
    this.validateId(id);
    this.validateOrderId(orderId);
    this.validateProductId(productId);
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
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("OrderItem ID cannot be empty");
    }
    if (!uuidValidate(id)) {
      throw new Error("OrderItem ID must be a valid UUID");
    }
  }

  private validateOrderId(orderId: string): void {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error("Order ID cannot be empty");
    }
    if (!uuidValidate(orderId)) {
      throw new Error("Order ID must be a valid UUID");
    }
  }

  private validateProductId(productId: string): void {
    if (!productId || productId.trim().length === 0) {
      throw new Error("Product ID cannot be empty");
    }
    if (!uuidValidate(productId)) {
      throw new Error("Product ID must be a valid UUID");
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

  // Utility method to convert to plain object
  toJSON() {
    return {
      id: this._id,
      orderId: this._orderId,
      productId: this._productId,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      totalPrice: this._totalPrice,
      observation: this._observation,
    };
  }
}

export default OrderItem;
