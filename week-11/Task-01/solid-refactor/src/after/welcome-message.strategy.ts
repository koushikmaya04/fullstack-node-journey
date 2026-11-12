import { UserRecord, WelcomeMessage, WelcomeMessageStrategy } from "./contracts";

export class FreeWelcomeStrategy implements WelcomeMessageStrategy {
  messageFor(user: UserRecord): WelcomeMessage {
    return { subject: "Welcome!", body: \`Thanks for joining, \${user.name}. You can upgrade any time.\` };
  }
}
export class ProWelcomeStrategy implements WelcomeMessageStrategy {
  messageFor(user: UserRecord): WelcomeMessage {
    return { subject: "Welcome to Pro!", body: \`Thanks for choosing Pro, \${user.name}. Premium features are ready.\` };
  }
}
export class TeamWelcomeStrategy implements WelcomeMessageStrategy {
  messageFor(user: UserRecord): WelcomeMessage {
    return { subject: "Welcome to Team!", body: \`Your team workspace is ready, \${user.name}.\` };
  }
}

// Composition/configuration is the extension point. Register another strategy here.
export const welcomeStrategies = {
  free: new FreeWelcomeStrategy(),
  pro: new ProWelcomeStrategy(),
  team: new TeamWelcomeStrategy(),
} satisfies Record<UserRecord["plan"], WelcomeMessageStrategy>;
