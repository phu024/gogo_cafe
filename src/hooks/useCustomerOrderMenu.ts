import { useMemo, useCallback } from 'react';
import type { MenuItem } from '@/types';

export function useOrderMenuLogic(menuItems: MenuItem[], selectedCategory: number | null) {
  const getItemsByCategory = useCallback((categoryId: number) => {
    return menuItems.filter(item => item.category_id === categoryId);
  }, [menuItems]);

  const displayItems = useMemo(() => {
    return selectedCategory ? getItemsByCategory(selectedCategory) : menuItems;
  }, [menuItems, selectedCategory, getItemsByCategory]);

  return {
    getItemsByCategory,
    displayItems,
  };
}
