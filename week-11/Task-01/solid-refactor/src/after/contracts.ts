export interface UserRecord {
  id: number;
  name: string;
  email: string;
  plan: "free" | "pro" | "team";
}
export type NewUser = Omit<UserRecord, "id">;

export interface UserRepository {
  save(user: NewUser): Promise<UserRecord>;
}
export interface MailClient {
  send(to: string, subject: string, body: string): Promise<void>;
}
export interface WelcomeMessage {
  subject: string;
  body: string;
}
export interface WelcomeMessageStrategy {
  messageFor(user: UserRecord): WelcomeMessage;
}
