const assert = require('node:assert/strict');
const MiniEventEmitter = require('./mini-event-emitter');
const configA = require('./singleton-config');
const configB = require('./singleton-config');
const {
  createNotification,
  EmailNotification,
  SmsNotification,
  PushNotification,
} = require('./notification-factory');

// Observer pattern: on + emit
{
  const emitter = new MiniEventEmitter();
  const received = [];

  emitter.on('message', (value) => received.push(value));
  emitter.emit('message', 'hello');

  assert.deepEqual(received, ['hello']);
}

// Observer pattern: off
{
  const emitter = new MiniEventEmitter();
  let calls = 0;
  const listener = () => {
    calls += 1;
  };

  emitter.on('event', listener);
  emitter.off('event', listener);
  emitter.emit('event');

  assert.equal(calls, 0);
}

// Observer pattern: once
{
  const emitter = new MiniEventEmitter();
  let calls = 0;

  emitter.once('login', () => {
    calls += 1;
  });

  emitter.emit('login');
  emitter.emit('login');

  assert.equal(calls, 1);
}

// Singleton: both imports point to the same instance.
{
  configA.set('environment', 'development');

  assert.equal(configA, configB);
  assert.equal(configB.get('environment'), 'development');
  assert.deepEqual(configA.getAll(), { environment: 'development' });
}

// Factory: each type creates the appropriate object.
{
  const email = createNotification('email', 'user@example.com', 'Welcome');
  const sms = createNotification('sms', '+919999999999', 'OTP: 1234');
  const push = createNotification('push', 'user-42', 'New message');

  assert.ok(email instanceof EmailNotification);
  assert.ok(sms instanceof SmsNotification);
  assert.ok(push instanceof PushNotification);

  assert.equal(email.type, 'email');
  assert.equal(sms.type, 'sms');
  assert.equal(push.type, 'push');
  assert.match(email.send(), /Email sent/);
  assert.match(sms.send(), /SMS sent/);
  assert.match(push.send(), /Push notification sent/);

  assert.throws(
    () => createNotification('fax', 'unknown', 'Hello'),
    /Unsupported notification type/,
  );
}

console.log('Week 06 Task 01: all tests passed.');
