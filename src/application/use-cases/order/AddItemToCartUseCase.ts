import { OrderItem, MenuItem, Topping } from '../../../domain/entities/Order';
import { Quantity } from '../../../domain/value-objects/Quantity';
import { OrderCalculationService } from '../../../domain/services/OrderCalculationService';

export interface AddItemToCartRequest {
  menuItem: MenuItem;
  toppings: Topping[];
  quantity: number;
  notes: string;
  sugarLevel: number;
}

export interface AddItemToCartResponse {
  item: OrderItem;
}

export class AddItemToCartUseCase {
  execute(request: AddItemToCartRequest): AddItemToCartResponse {
    const quantity = Quantity.create(request.quantity);
    const totalPrice = OrderCalculationService.calculateItemTotalPrice(
      request.menuItem,
      request.toppings,
      quantity
    );

    const item: OrderItem = {
      id: Date.now(),
      menuItem: request.menuItem,
      toppings: request.toppings,
      quantity: quantity.getValue(),
      notes: request.notes,
      totalPrice: totalPrice.getValue(),
      sugarLevel: request.sugarLevel,
    };

    return { item };
  }
}
