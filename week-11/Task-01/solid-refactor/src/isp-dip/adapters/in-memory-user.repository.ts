import { NewUser, UserRecord } from "../../after/contracts";
import { UserReaderRepository } from "../contracts/user-reader.repository";
import { UserWriterRepository } from "../contracts/user-writer.repository";
import { UserRemoverRepository } from "../contracts/user-remover.repository";

// One adapter can implement several small contracts; consumers still depend
// only on the capability they actually use.
export class InMemoryUserRepository
  implements UserReaderRepository, UserWriterRepository, UserRemoverRepository {
  private readonly users = new Map<number, UserRecord>();
  private nextId = 1;

  async findById(id: number): Promise<UserRecord | null> {
    return this.users.get(id) ?? null;
  }

  async save(input: NewUser): Promise<UserRecord> {
    const user: UserRecord = { id: this.nextId++, ...input };
    this.users.set(user.id, user);
    return user;
  }

  async remove(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
}
