import { RegisterUserValidator } from "../src/after/register-user.validator";
import { FreeWelcomeStrategy, ProWelcomeStrategy, TeamWelcomeStrategy } from "../src/after/welcome-message.strategy";
import { UserRecord, WelcomeMessageStrategy } from "../src/after/contracts";

describe("RegisterUserValidator", () => {
  const validator = new RegisterUserValidator();

  it("normalizes the name and email", () => {
    expect(validator.validate({ name: "  Maya  ", email: "  MAYA@example.com " })).toEqual({
      name: "Maya", email: "maya@example.com", plan: "free",
    });
  });

  it("rejects invalid names and email addresses", () => {
    expect(() => validator.validate({ name: "A", email: "maya@example.com" })).toThrow();
    expect(() => validator.validate({ name: "Maya", email: "not-an-email" })).toThrow();
  });

  it("defaults unknown plans to free", () => {
    expect(validator.validate({ name: "Maya", email: "maya@example.com", plan: "unknown" }).plan).toBe("free");
  });
});

describe("WelcomeMessageStrategy contract (LSP)", () => {
  const strategies: WelcomeMessageStrategy[] = [
    new FreeWelcomeStrategy(), new ProWelcomeStrategy(), new TeamWelcomeStrategy(),
  ];
  const validUser: UserRecord = {
    id: 7, name: "Maya", email: "maya@example.com", plan: "free",
  };

  it.each(strategies.map((strategy, index) => [index, strategy] as const))(
    "implementation %i honors the shared contract",
    (_index, strategy) => {
      const original = { ...validUser };
      const message = strategy.messageFor(validUser);
      expect(message.subject.trim().length).toBeGreaterThan(0);
      expect(message.body.trim().length).toBeGreaterThan(0);
      expect(message.body).toContain(validUser.name);
      expect(validUser).toEqual(original);
    },
  );
});

describe("strategy extension (OCP)", () => {
  it("adds a team message without changing the registration workflow", () => {
    const message = new TeamWelcomeStrategy().messageFor({
      id: 8, name: "Alex", email: "alex@example.com", plan: "team",
    });
    expect(message.subject).toBe("Welcome to Team!");
    expect(message.body).toContain("Alex");
  });
});
