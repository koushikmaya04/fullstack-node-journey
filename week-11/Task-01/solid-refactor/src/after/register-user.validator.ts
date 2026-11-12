export interface RegisterUserInput { name: string; email: string; plan?: string; }
export interface ValidatedRegisterUser { name: string; email: string; plan: "free" | "pro"; }

export class RegisterUserValidator {
  validate(input: RegisterUserInput): ValidatedRegisterUser {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    if (!name || name.length < 2) throw new Error("Name must be at least 2 characters");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("A valid email is required");
    }
    const plan = input.plan === "pro" ? "pro" : "free";
    return { name, email, plan };
  }
}
