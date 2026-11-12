import "reflect-metadata";
import { Test } from "@nestjs/testing";
import { UserRecord } from "../src/after/contracts";
import { GetUserService } from "../src/isp-dip/after/get-user.service";
import { InMemoryUserRepository } from "../src/isp-dip/adapters/in-memory-user.repository";
import { UserModule } from "../src/isp-dip/user.module";
import { USER_READER, USER_REMOVER, USER_WRITER } from "../src/isp-dip/tokens/user-repository.tokens";

describe("ISP: segregated repository contracts", () => {
  it("allows a read-only consumer to receive an object with no write methods", async () => {
    const user: UserRecord = {
      id: 1, name: "Maya", email: "maya@example.com", plan: "free",
    };
    const readerOnly = { findById: jest.fn().mockResolvedValue(user) };
    const service = new GetUserService(readerOnly);

    await expect(service.execute(1)).resolves.toEqual(user);
    expect(readerOnly.findById).toHaveBeenCalledWith(1);
    expect("save" in readerOnly).toBe(false);
    expect("remove" in readerOnly).toBe(false);
  });
});

describe("DIP: NestJS token-based dependency injection", () => {
  it("resolves the reader token to the configured adapter", async () => {
    const moduleRef = await Test.createTestingModule({ imports: [UserModule] }).compile();
    const service = moduleRef.get(GetUserService);
    const reader = moduleRef.get(USER_READER);
    const writer = moduleRef.get(USER_WRITER);
    const remover = moduleRef.get(USER_REMOVER);

    expect(reader).toBeInstanceOf(InMemoryUserRepository);
    expect(writer).toBe(reader);
    expect(remover).toBe(reader);

    const created = await reader.save({
      name: "Maya", email: "maya@example.com", plan: "free",
    });
    await expect(service.execute(created.id)).resolves.toEqual(created);
    await moduleRef.close();
  });

  it("swaps the reader implementation through a Nest testing override", async () => {
    const alternateUser: UserRecord = {
      id: 42, name: "Alternative", email: "alternate@example.com", plan: "pro",
    };
    const alternateReader = {
      findById: jest.fn().mockResolvedValue(alternateUser),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(USER_READER)
      .useValue(alternateReader)
      .compile();

    await expect(moduleRef.get(GetUserService).execute(42)).resolves.toEqual(alternateUser);
    expect(alternateReader.findById).toHaveBeenCalledWith(42);
    await moduleRef.close();
  });
});
