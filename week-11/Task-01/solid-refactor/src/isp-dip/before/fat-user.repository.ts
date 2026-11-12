import { NewUser, UserRecord } from "../../after/contracts";

// Deliberately oversized contract: every consumer gets methods it may not need.
export interface FatUserRepository {
  findById(id: number): Promise<UserRecord | null>;
  save(user: NewUser): Promise<UserRecord>;
  remove(id: number): Promise<boolean>;
  findAll(): Promise<UserRecord[]>;
  exportCsv(): Promise<string>;
}
