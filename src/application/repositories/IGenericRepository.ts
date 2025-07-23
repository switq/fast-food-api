import { BaseEntity } from "@src/domain/entities/BaseEntity";

export interface IGenericRepository<T extends BaseEntity> {
    findById(id: T["id"]): Promise<T | null>
    findAll(): Promise<T[]>
    create(item: T): Promise<T>
    update(item: T): Promise<T>
    delete(id: T["id"]): Promise<void>
}
