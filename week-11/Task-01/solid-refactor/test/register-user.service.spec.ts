import { RegisterUserService } from "../src/after/register-user.service";
import { RegisterUserValidator } from "../src/after/register-user.validator";
import { UserRecord } from "../src/after/contracts";
import { welcomeStrategies } from "../src/after/welcome-message.strategy";

describe("RegisterUserService", () => {
  it("validates, saves, and sends the matching welcome email", async () => {
    const saved: UserRecord = { id: 1, name: "Maya", email: "maya@example.com", plan: "pro" };
    const save = jest.fn().mockResolvedValue(saved);
    const send = jest.fn().mockResolvedValue(undefined);
    const service = new RegisterUserService(
      new RegisterUserValidator(),
      { save },
      { send },
      welcomeStrategies,
    );

    await expect(service.register({
      name: " Maya ", email: "MAYA@example.com", plan: "pro",
    })).resolves.toEqual(saved);

    expect(save).toHaveBeenCalledWith({ name: "Maya", email: "maya@example.com", plan: "pro" });
    expect(send).toHaveBeenCalledWith(
      "maya@example.com",
      "Welcome to Pro!",
      expect.stringContaining("Maya"),
    );
  });
});
