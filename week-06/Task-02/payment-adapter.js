class LegacyPaymentGateway {
  makePayment(amountInPaise) {
    return `Legacy payment of ${amountInPaise} paise processed`;
  }
}

class PaymentAdapter {
  constructor(legacyGateway) {
    this.legacyGateway = legacyGateway;
  }

  pay(amountInRupees) {
    if (amountInRupees <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    const amountInPaise = Math.round(amountInRupees * 100);
    return this.legacyGateway.makePayment(amountInPaise);
  }
}

class CheckoutPaymentService {
  constructor(paymentProvider) {
    this.paymentProvider = paymentProvider;
  }

  pay(amount) {
    return this.paymentProvider.pay(amount);
  }
}

module.exports = {
  LegacyPaymentGateway,
  PaymentAdapter,
  CheckoutPaymentService,
};
