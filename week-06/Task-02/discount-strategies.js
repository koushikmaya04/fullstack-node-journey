class NoDiscount {
  calculate(amount) {
    return amount;
  }
}

class PercentageDiscount {
  constructor(percent) {
    this.percent = percent;
  }

  calculate(amount) {
    return amount - (amount * this.percent) / 100;
  }
}

class FlatDiscount {
  constructor(discount) {
    this.discount = discount;
  }

  calculate(amount) {
    return Math.max(0, amount - this.discount);
  }
}

class Checkout {
  constructor(discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  setDiscountStrategy(discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  getFinalAmount(amount) {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }

    return this.discountStrategy.calculate(amount);
  }
}

module.exports = {
  NoDiscount,
  PercentageDiscount,
  FlatDiscount,
  Checkout,
};
