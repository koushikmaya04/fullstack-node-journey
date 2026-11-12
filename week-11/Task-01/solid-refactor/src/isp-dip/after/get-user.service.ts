import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserReaderRepository } from "../contracts/user-reader.repository";
import { USER_READER } from "../tokens/user-repository.tokens";

@Injectable()
export class GetUserService {
  constructor(
    @Inject(USER_READER)
    private readonly users: UserReaderRepository,
  ) {}

  async execute(id: number) {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException(`User ${id} was not found`);
    return user;
  }
}
