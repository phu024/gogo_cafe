import { MenuItem, Topping } from '../entities/Order';
import { Price } from '../value-objects/Price';
import { Quantity } from '../value-objects/Quantity';

export class OrderCalculationService {
  static calculateItemUnitPrice(menuItem: MenuItem, toppings: Topping[]): Price {
    const basePrice = Price.create(menuItem.basePrice);
    const toppingsPrice = toppings.reduce(
      (sum, topping) => sum.add(Price.create(topping.price)),
      Price.zero()
    );
    return basePrice.add(toppingsPrice);
  }

  static calculateItemTotalPrice(
    menuItem: MenuItem, 
    toppings: Topping[], 
    quantity: Quantity
  ): Price {
    const unitPrice = this.calculateItemUnitPrice(menuItem, toppings);
    return unitPrice.multiply(quantity.getValue());
  }

  static calculateOrderTotal(items: Array<{ totalPrice: number }>): Price {
    return items.reduce(
      (sum, item) => sum.add(Price.create(item.totalPrice)),
      Price.zero()
    );
  }

  static calculateTotalItems(items: Array<{ quantity: number }>): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
