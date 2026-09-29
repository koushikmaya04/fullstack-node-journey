class EmailNotification {
  constructor(recipient, message) {
    this.type = 'email';
    this.recipient = recipient;
    this.message = message;
  }

  send() {
    return `Email sent to ${this.recipient}: ${this.message}`;
  }
}

class SmsNotification {
  constructor(recipient, message) {
    this.type = 'sms';
    this.recipient = recipient;
    this.message = message;
  }

  send() {
    return `SMS sent to ${this.recipient}: ${this.message}`;
  }
}

class PushNotification {
  constructor(recipient, message) {
    this.type = 'push';
    this.recipient = recipient;
    this.message = message;
  }

  send() {
    return `Push notification sent to ${this.recipient}: ${this.message}`;
  }
}

function createNotification(type, recipient, message) {
  switch (type.toLowerCase()) {
    case 'email':
      return new EmailNotification(recipient, message);
    case 'sms':
      return new SmsNotification(recipient, message);
    case 'push':
      return new PushNotification(recipient, message);
    default:
      throw new Error(`Unsupported notification type: ${type}`);
  }
}

module.exports = {
  createNotification,
  EmailNotification,
  SmsNotification,
  PushNotification,
};
