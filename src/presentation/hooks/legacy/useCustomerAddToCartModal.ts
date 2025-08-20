import { useState, useCallback, useMemo } from 'react';
import type { MenuItem, Topping } from '@/types';

export function useAddToCartModalLogic(selectedItem: MenuItem | null, selectedToppings: Topping[], quantity: number) {
  const [qtyError, setQtyError] = useState<string | undefined>(undefined);
  
  const totalPrice = useMemo(() => {
    if (!selectedItem) return 0;
    const basePrice = selectedItem.base_price * quantity;
    const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0) * quantity;
    return basePrice + toppingsPrice;
  }, [selectedItem, selectedToppings, quantity]);

  const validateQty = useCallback((val: number) => {
    if (!Number.isFinite(val) || val < 1) {
      setQtyError('จำนวนต้องเป็นตัวเลขตั้งแต่ 1 ขึ้นไป');
      return false;
    }
    setQtyError(undefined);
    return true;
  }, []);

  return {
    qtyError,
    setQtyError,
    validateQty,
    totalPrice,
  };
};
