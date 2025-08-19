import { OrderItem } from '../../../domain/entities/Order';
import { Quantity } from '../../../domain/value-objects/Quantity';
import { OrderCalculationService } from '../../../domain/services/OrderCalculationService';

export interface UpdateCartItemQuantityRequest {
  item: OrderItem;
  newQuantity: number;
}

export interface UpdateCartItemQuantityResponse {
  updatedItem: OrderItem;
}

export class UpdateCartItemQuantityUseCase {
  execute(request: UpdateCartItemQuantityRequest): UpdateCartItemQuantityResponse {
    const quantity = Quantity.create(request.newQuantity);
    const totalPrice = OrderCalculationService.calculateItemTotalPrice(
      request.item.menuItem,
      request.item.toppings,
      quantity
    );

    const updatedItem: OrderItem = {
      ...request.item,
      quantity: quantity.getValue(),
      totalPrice: totalPrice.getValue(),
    };

    return { updatedItem };
  }
}
