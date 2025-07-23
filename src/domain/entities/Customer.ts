import { UUIDService } from "@src/domain/services/UUIDService";
import CPF from "@src/domain/value-objects/CPF";
import Phone from "@src/domain/value-objects/Phone";
import { BaseEntity } from "./BaseEntity";


class Customer implements BaseEntity {
  private _id: string;
  private _name: string;
  private _email: string;
  private _phone?: Phone;
  private _cpf: CPF;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    cpf: string,
    phone?: string,
    uuidService?: UUIDService,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateId(id, uuidService);
    this.validateName(name);
    this.validateEmail(email);
    this._id = id;
    this._name = name;
    this._email = email;
    this._cpf = new CPF(cpf);
    this._phone = phone ? new Phone(phone) : undefined;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    phone: string | undefined,
    uuidService: UUIDService
  ): Customer {
    const now = new Date();
    return new Customer(uuidService.generate(), name, email, cpf, phone, uuidService, now, now);
  }

  private validateId(id: string, uuidService?: UUIDService): void {
    if (!id || id.trim().length === 0) {
      throw new Error("Customer ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(id)) {
        throw new Error("Customer ID must be a valid UUID");
      }
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Customer name cannot be empty");
    }
    if (name.length < 3) {
      throw new Error("Customer name must be at least 3 characters long");
    }
    if (name.length > 100) {
      throw new Error("Customer name cannot exceed 100 characters");
    }
  }

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error("Customer email cannot be empty");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  // Getters

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string | undefined {
    return this._phone?.value;
  }

  get cpf(): string {
    return this._cpf.value;
  }

  // Setters
  set name(name: string) {
    this.validateName(name);
    this._name = name;
  }

  set email(email: string) {
    this.validateEmail(email);
    this._email = email;
  }

  set phone(phone: string | undefined) {
    this._phone = phone ? new Phone(phone) : undefined;
  }

  set cpf(cpf: string) {
    this._cpf = new CPF(cpf);
  }

  // Note: No setter for ID as it should be immutable after creation

}

export default Customer;
