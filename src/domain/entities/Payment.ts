import { UUIDService } from "../services/UUIDService";
import { BaseEntity } from "./BaseEntity";

export enum PaymentStatus {
  PAID = "PAID",
  NOT_PAID = "NOT_PAID"
}

class Payment implements BaseEntity {
  private _id: string;
  private _orderId: string;
  private _amount: number;
  private _paymentStatus: PaymentStatus;
  private _paidAt: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    orderId: string,
    amount: number,
    paymentStatus: PaymentStatus,
    paidAt: Date,
    uuidService?: UUIDService,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateId(id, uuidService);
    this.validateOrderId(orderId, uuidService);
    this.validateAmount(amount);
    this.validatePaidAt(paidAt);
    this._id = id;
    this._orderId = orderId;
    this._amount = amount;
    this._paymentStatus = paymentStatus;
    this._paidAt = paidAt;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create(
    orderId: string,
    amount: number,
    paymentStatus: PaymentStatus,
    paidAt: Date,
    uuidService: UUIDService
  ): Payment {
    const now = new Date();
    return new Payment(
      uuidService.generate(),
      orderId,
      amount,
      paymentStatus,
      paidAt,
      uuidService,
      now,
      now
    );
  }

  private validateId(id: string, uuidService?: UUIDService): void {
    if (!id || id.trim().length === 0) {
      throw new Error("Payment ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(id)) {
        throw new Error("Payment ID must be a valid UUID");
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

  private validateAmount(amount: number): void {
    if (amount === undefined || amount === null) {
      throw new Error("Amount cannot be empty");
    }
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
  }

  private validatePaidAt(paidAt: Date): void {
    if (!(paidAt instanceof Date) || isNaN(paidAt.getTime())) {
      throw new Error("paidAt must be a valid Date");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get orderId(): string {
    return this._orderId;
  }

  get amount(): number {
    return this._amount;
  }

  get paymentStatus(): PaymentStatus {
    return this._paymentStatus;
  }

  get paidAt(): Date {
    return this._paidAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  set paymentStatus(status: PaymentStatus) {
    this._paymentStatus = status;
    this._updatedAt = new Date();
  }

  set paidAt(date: Date) {
    this.validatePaidAt(date);
    this._paidAt = date;
    this._updatedAt = new Date();
  }

  set amount(amount: number) {
    this.validateAmount(amount);
    this._amount = amount;
    this._updatedAt = new Date();
  }
}

export default Payment;
