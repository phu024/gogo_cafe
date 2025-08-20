import { useMemo } from 'react';
import { CartItem } from '@/types';

export const useOrderCartLogic = (cart: CartItem[]) => {
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return {
    totalAmount,
    totalItems,
  };
};
