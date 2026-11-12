import { NewUser, UserRecord } from "../../after/contracts";

export interface UserWriterRepository {
  save(user: NewUser): Promise<UserRecord>;
}
