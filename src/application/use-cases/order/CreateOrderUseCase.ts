import { Order, OrderItem, OrderStatus } from '../../../domain/entities/Order';
import { OrderCalculationService } from '../../../domain/services/OrderCalculationService';
import { OrderIdGenerator } from '../../../domain/services/OrderIdGenerator';

export interface CreateOrderRequest {
  items: OrderItem[];
  status?: OrderStatus;
}

export interface CreateOrderResponse {
  order: Order;
}

export class CreateOrderUseCase {
  execute(request: CreateOrderRequest): CreateOrderResponse {
    const totalAmount = OrderCalculationService.calculateOrderTotal(request.items);
    const totalItems = OrderCalculationService.calculateTotalItems(request.items);

    const order: Order = {
      id: OrderIdGenerator.generate(),
      items: request.items,
      totalAmount: totalAmount.getValue(),
      totalItems,
      status: request.status || 'WAITING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return { order };
  }
}
