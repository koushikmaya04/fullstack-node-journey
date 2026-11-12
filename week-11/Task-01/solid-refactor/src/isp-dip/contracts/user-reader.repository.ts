import { UserRecord } from "../../after/contracts";

// A client that only reads users should not be forced to depend on write methods.
export interface UserReaderRepository {
  findById(id: number): Promise<UserRecord | null>;
}
