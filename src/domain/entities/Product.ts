import { UUIDService } from "@src/domain/services/UUIDService";
import { BaseEntity } from "./BaseEntity";

import URLValueObject from "../value-objects/URL";

class Product implements BaseEntity {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _categoryId: string;
  private _imageUrl?: URLValueObject;
  private _isAvailable: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    categoryId: string,
    imageUrl?: string,
    isAvailable: boolean = true,
    uuidService?: UUIDService,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateId(id, uuidService);
    this.validateName(name);
    this.validateDescription(description);
    this.validatePrice(price);
    this.validateCategoryId(categoryId);
    if (imageUrl) {
      this._imageUrl = new URLValueObject(imageUrl);
    }
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._categoryId = categoryId;
    this._isAvailable = isAvailable;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create(
    name: string,
    description: string,
    price: number,
    categoryId: string,
    imageUrl: string | undefined,
    isAvailable: boolean,
    uuidService: UUIDService
  ): Product {
    const now = new Date();
    return new Product(
      uuidService.generate(),
      name,
      description,
      price,
      categoryId,
      imageUrl,
      isAvailable,
      uuidService,
      now,
      now
    );
  }

  private validateId(id: string, uuidService?: UUIDService): void {
    if (!id || id.trim().length === 0) {
      throw new Error("Product ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(id)) {
        throw new Error("Product ID must be a valid UUID");
      }
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Product name cannot be empty");
    }
    if (name.length < 3) {
      throw new Error("Product name must be at least 3 characters long");
    }
    if (name.length > 100) {
      throw new Error("Product name cannot exceed 100 characters");
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error("Product description cannot be empty");
    }
    if (description.length > 500) {
      throw new Error("Product description cannot exceed 500 characters");
    }
  }

  private validatePrice(price: number): void {
    if (price === undefined || price === null) {
      throw new Error("Product price cannot be empty");
    }
    if (price < 0) {
      throw new Error("Product price cannot be negative");
    }
  }

  private validateCategoryId(categoryId: string): void {
    if (!categoryId || categoryId.trim().length === 0) {
      throw new Error("Category ID cannot be empty");
    }
  }

  // No longer needed: imageUrl validation is handled by URLValueObject

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

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl?.value;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  // Setters
  set name(name: string) {
    this.validateName(name);
    this._name = name;
  }

  set description(description: string) {
    this.validateDescription(description);
    this._description = description;
  }

  set price(price: number) {
    this.validatePrice(price);
    this._price = price;
  }

  set categoryId(categoryId: string) {
    this.validateCategoryId(categoryId);
    this._categoryId = categoryId;
  }

  set imageUrl(imageUrl: string | undefined) {
    if (imageUrl) {
      this._imageUrl = new URLValueObject(imageUrl);
    } else {
      this._imageUrl = undefined;
    }
  }

  set isAvailable(isAvailable: boolean) {
    this._isAvailable = isAvailable;
  }

  // Note: No setter for ID as it should be immutable after creation

  // Remove toJSON method for clean architecture
}

export default Product;
