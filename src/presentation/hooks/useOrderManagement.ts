import { useState, useCallback } from 'react';
import { OrderItem, MenuItem, Topping, OrderStatus } from '../../domain/entities/Order';
import { AddItemToCartUseCase } from '../../application/use-cases/order/AddItemToCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../../application/use-cases/order/UpdateCartItemQuantityUseCase';
import { CreateOrderUseCase } from '../../application/use-cases/order/CreateOrderUseCase';

export type OrderStep = 'menu' | 'cart' | 'payment' | 'success';

export const useOrderManagement = () => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentStep, setCurrentStep] = useState<OrderStep>('menu');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('WAITING');

  const addItemToCart = useCallback((
    menuItem: MenuItem,
    toppings: Topping[],
    quantity: number,
    notes: string,
    sugarLevel: number
  ) => {
    const useCase = new AddItemToCartUseCase();
    const result = useCase.execute({
      menuItem,
      toppings,
      quantity,
      notes,
      sugarLevel,
    });

    setCart(prev => [...prev, result.item]);
    return result.item;
  }, []);

  const updateCartItemQuantity = useCallback((itemId: number, newQuantity: number) => {
    const useCase = new UpdateCartItemQuantityUseCase();
    
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const result = useCase.execute({ item, newQuantity });
        return result.updatedItem;
      }
      return item;
    }));
  }, []);

  const removeCartItem = useCallback((itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const createOrder = useCallback(() => {
    const useCase = new CreateOrderUseCase();
    const result = useCase.execute({ items: cart });
    return result.order;
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const goToStep = useCallback((step: OrderStep) => {
    setCurrentStep(step);
  }, []);

  const updateOrderStatus = useCallback((status: OrderStatus) => {
    setOrderStatus(status);
  }, []);

  return {
    // State
    cart,
    currentStep,
    orderStatus,
    
    // Actions
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem,
    createOrder,
    clearCart,
    goToStep,
    updateOrderStatus,
  };
};
