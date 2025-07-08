import { DbParam } from "../types/DbParam";

export interface DbConnection {
  findByParams(
    tableName: string,
    fields: string[] | null,
    params: DbParam[]
  ): Promise<any>;

  findAll(tableName: string, fields?: string[] | null): Promise<any[]>;

  insert(tableName: string, params: DbParam[]): Promise<void>;

  update(tableName: string, id: string, params: DbParam[]): Promise<void>;

  delete(tableName: string, id: string): Promise<void>;

  getLastId(tableName: string): Promise<number>;
}
