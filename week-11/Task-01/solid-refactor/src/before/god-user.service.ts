// Deliberately bad: this one class validates input, applies business rules,
// writes to the database, and sends email. Every change has to go through it.
interface UserRecord {
  id: number;
  name: string;
  email: string;
  plan: "free" | "pro";
}
interface UserRepository {
  save(user: Omit<UserRecord, "id">): Promise<UserRecord>;
}
interface MailClient {
  send(to: string, subject: string, body: string): Promise<void>;
}
export class GodUserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly mailer: MailClient,
  ) {}
  async register(input: { name: string; email: string; plan?: string }) {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    if (!name || name.length < 2) throw new Error("Name must be at least 2 characters");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("A valid email is required");
    }
    const plan = input.plan === "pro" ? "pro" : "free";
    const welcomeSubject = plan === "pro" ? "Welcome to Pro!" : "Welcome!";
    const welcomeBody =
      plan === "pro"
        ? "Thanks for choosing Pro. Your premium features are ready."
        : "Thanks for joining. You can upgrade any time.";
    const user = await this.repository.save({ name, email, plan });
    await this.mailer.send(user.email, welcomeSubject, welcomeBody);
    return user;
  }
}
