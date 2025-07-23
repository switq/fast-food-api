import { UUIDService } from "@src/domain/services/UUIDService";
import { BaseEntity } from "./BaseEntity";

class Category implements BaseEntity {
  private _id: string;
  private _name: string;
  private _description: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    uuidService?: UUIDService,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateId(id, uuidService);
    this.validateName(name);
    this.validateDescription(description);
    this._id = id;
    this._name = name;
    this._description = description;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create(
    name: string,
    description: string,
    uuidService: UUIDService
  ): Category {
    const now = new Date();
    return new Category(uuidService.generate(), name, description, uuidService, now, now);
  }

  private validateId(id: string, uuidService?: UUIDService): void {
    if (!id || id.trim().length === 0) {
      throw new Error("Category ID cannot be empty");
    }
    if (uuidService) {
      if (!uuidService.validate(id)) {
        throw new Error("Category ID must be a valid UUID");
      }
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Category name cannot be empty");
    }
    if (name.length < 3) {
      throw new Error("Category name must be at least 3 characters long");
    }
    if (name.length > 50) {
      throw new Error("Category name cannot exceed 50 characters");
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error("Category description cannot be empty");
    }
    if (description.length > 255) {
      throw new Error("Category description cannot exceed 255 characters");
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

  get description(): string {
    return this._description;
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

  // Note: No setter for ID as it should be immutable after creation

  // Utility method to convert to plain object
}


export default Category;