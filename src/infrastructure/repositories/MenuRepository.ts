import { MenuItem, MenuCategory, Topping } from '../../domain/entities/Order';
import { menuCategories as mockMenuCategories, menuItems as mockMenuItems, toppings as mockToppings } from '../../lib/mock-data';

export interface IMenuRepository {
  getMenuItems(): Promise<MenuItem[]>;
  getMenuCategories(): Promise<MenuCategory[]>;
  getToppings(): Promise<Topping[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
}

export class MockMenuRepository implements IMenuRepository {
  async getMenuItems(): Promise<MenuItem[]> {
    return mockMenuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      basePrice: item.base_price,
      categoryId: item.category_id,
      imageUrl: item.image_url,
      isAvailable: item.is_available,
    }));
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    return mockMenuCategories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
    }));
  }

  async getToppings(): Promise<Topping[]> {
    return mockToppings.map(topping => ({
      id: topping.id,
      name: topping.name,
      price: topping.price,
    }));
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    const items = await this.getMenuItems();
    return items.filter(item => item.categoryId === categoryId);
  }
}
