export class Price {
  private constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Price cannot be negative');
    }
  }

  static create(value: number): Price {
    return new Price(value);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Price): Price {
    return new Price(this.value + other.value);
  }

  multiply(factor: number): Price {
    return new Price(this.value * factor);
  }

  format(): string {
    return this.value.toLocaleString('th-TH', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  static zero(): Price {
    return new Price(0);
  }
}
