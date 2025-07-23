import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { UUIDService } from "@src/domain/services/UUIDService";

export class UuidServiceImpl implements UUIDService {
  generate(): string {
    return uuidv4();
  }
  validate(id: string): boolean {
    return uuidValidate(id);
  }
}