import { Module } from "@nestjs/common";
import { InMemoryUserRepository } from "./adapters/in-memory-user.repository";
import { GetUserService } from "./after/get-user.service";
import { USER_READER, USER_REMOVER, USER_WRITER } from "./tokens/user-repository.tokens";

// useExisting makes all capability tokens resolve to the same adapter instance.
// Swap the implementation here (or override a token in a test) without changing
// GetUserService.
@Module({
  providers: [
    InMemoryUserRepository,
    { provide: USER_READER, useExisting: InMemoryUserRepository },
    { provide: USER_WRITER, useExisting: InMemoryUserRepository },
    { provide: USER_REMOVER, useExisting: InMemoryUserRepository },
    GetUserService,
  ],
  exports: [GetUserService, USER_READER, USER_WRITER, USER_REMOVER],
})
export class UserModule {}
