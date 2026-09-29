const assert = require("node:assert/strict");

const {
  NoDiscount,
  PercentageDiscount,
  FlatDiscount,
  Checkout,
} = require("./discount-strategies");

const {
  LegacyPaymentGateway,
  PaymentAdapter,
  CheckoutPaymentService,
} = require("./payment-adapter");

// Strategy pattern tests
const checkout = new Checkout(new NoDiscount());
assert.equal(checkout.getFinalAmount(1000), 1000);

checkout.setDiscountStrategy(new PercentageDiscount(10));
assert.equal(checkout.getFinalAmount(1000), 900);

checkout.setDiscountStrategy(new FlatDiscount(150));
assert.equal(checkout.getFinalAmount(1000), 850);

assert.throws(() => checkout.getFinalAmount(-1), /Amount cannot be negative/);

// Adapter pattern tests
const legacyGateway = new LegacyPaymentGateway();
const paymentAdapter = new PaymentAdapter(legacyGateway);
const paymentService = new CheckoutPaymentService(paymentAdapter);

assert.equal(
  paymentService.pay(250),
  "Legacy payment of 25000 paise processed"
);

assert.throws(() => paymentService.pay(0), /Payment amount must be greater than zero/);

console.log("Week 06 Task 02: all tests passed.");
