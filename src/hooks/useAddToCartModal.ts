import { useState, useEffect, useCallback } from 'react';
import type { MenuItem, Topping } from '@/types';

export function useAddToCartModalLogic(isVisible: boolean, selectedItem: MenuItem | null, selectedToppings: Topping[], quantity: number) {
  const [qtyError, setQtyError] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) setQtyError(null);
  }, [isVisible]);

  const validateQty = useCallback((val: number) => {
    if (!Number.isFinite(val) || val < 1) {
      setQtyError('จำนวนต้องเป็นตัวเลขตั้งแต่ 1 ขึ้นไป');
      return false;
    }
    setQtyError(null);
    return true;
  }, []);

  const getTotalPrice = useCallback(() => {
    if (!selectedItem) return 0;
    return (selectedItem.base_price + selectedToppings.reduce((sum, t) => sum + t.price, 0)) * quantity;
  }, [selectedItem, selectedToppings, quantity]);

  return {
    qtyError,
    setQtyError,
    validateQty,
    getTotalPrice,
  };
}
