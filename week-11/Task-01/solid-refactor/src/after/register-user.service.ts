import { RegisterUserInput, RegisterUserValidator } from "./register-user.validator";
import { MailClient, UserRecord, UserRepository, WelcomeMessageStrategy } from "./contracts";

export class RegisterUserService {
  constructor(
    private readonly validator: RegisterUserValidator,
    private readonly repository: UserRepository,
    private readonly mailer: MailClient,
    private readonly strategies: Record<string, WelcomeMessageStrategy>,
  ) {}

  async register(input: RegisterUserInput): Promise<UserRecord> {
    const valid = this.validator.validate(input);
    const user = await this.repository.save(valid);
    const strategy = this.strategies[user.plan];
    if (!strategy) throw new Error(\`No welcome-message strategy registered for plan: \${user.plan}\`);
    const message = strategy.messageFor(user);
    await this.mailer.send(user.email, message.subject, message.body);
    return user;
  }
}
