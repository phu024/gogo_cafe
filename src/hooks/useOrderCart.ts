import { useMemo } from 'react';
import type { CartItem } from '@/types';

export function useOrderCartLogic(cart: CartItem[]) {
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
}
