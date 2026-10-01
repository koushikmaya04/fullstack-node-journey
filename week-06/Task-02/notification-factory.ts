export type NotificationType = "email" | "sms" | "push";

export interface Notification {
  readonly type: NotificationType;
  readonly recipient: string;
  readonly message: string;
  send(): string;
}

export class EmailNotification implements Notification {
  readonly type = "email" as const;
  constructor(public readonly recipient: string, public readonly message: string) {}
  send(): string {
    return `Email sent to ${this.recipient}: ${this.message}`;
  }
}

export class SmsNotification implements Notification {
  readonly type = "sms" as const;
  constructor(public readonly recipient: string, public readonly message: string) {}
  send(): string {
    return `SMS sent to ${this.recipient}: ${this.message}`;
  }
}

export class PushNotification implements Notification {
  readonly type = "push" as const;
  constructor(public readonly recipient: string, public readonly message: string) {}
  send(): string {
    return `Push notification sent to ${this.recipient}: ${this.message}`;
  }
}

export function createNotification(
  type: NotificationType,
  recipient: string,
  message: string,
): Notification {
  switch (type) {
    case "email": return new EmailNotification(recipient, message);
    case "sms": return new SmsNotification(recipient, message);
    case "push": return new PushNotification(recipient, message);
    default: throw new Error(`Unsupported notification type: ${String(type)}`);
  }
}
