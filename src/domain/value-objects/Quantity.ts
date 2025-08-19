export class Quantity {
  private constructor(private readonly value: number) {
    if (value < 1) {
      throw new Error('Quantity must be at least 1');
    }
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  getValue(): number {
    return this.value;
  }

  increment(): Quantity {
    return new Quantity(this.value + 1);
  }

  decrement(): Quantity {
    if (this.value <= 1) {
      throw new Error('Quantity cannot be less than 1');
    }
    return new Quantity(this.value - 1);
  }

  canDecrement(): boolean {
    return this.value > 1;
  }

  multiply(factor: number): Quantity {
    return new Quantity(this.value * factor);
  }
}
