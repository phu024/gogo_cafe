import { useState, useEffect, useCallback } from 'react';
import { MenuItem, MenuCategory, Topping } from '../../domain/entities/Order';
import { MockMenuRepository } from '../../infrastructure/repositories/MenuRepository';

export const useMenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const menuRepository = new MockMenuRepository();

  const loadMenuData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [items, categories, toppingsData] = await Promise.all([
        menuRepository.getMenuItems(),
        menuRepository.getMenuCategories(),
        menuRepository.getToppings(),
      ]);

      setMenuItems(items);
      setMenuCategories(categories);
      setToppings(toppingsData);
    } catch (error) {
      console.error('Failed to load menu data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [menuRepository]);

  const getItemsByCategory = useCallback((categoryId: number | null) => {
    if (!categoryId) return menuItems;
    return menuItems.filter(item => item.categoryId === categoryId);
  }, [menuItems]);

  const selectCategory = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
  }, []);

  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  const displayItems = getItemsByCategory(selectedCategory);

  return {
    // State
    menuItems,
    menuCategories,
    toppings,
    selectedCategory,
    displayItems,
    isLoading,
    
    // Actions
    selectCategory,
    loadMenuData,
  };
};
