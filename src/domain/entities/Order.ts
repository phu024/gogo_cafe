export interface OrderItem {
  id: number;
  menuItem: MenuItem;
  toppings: Topping[];
  quantity: number;
  notes: string;
  totalPrice: number;
  sugarLevel: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  categoryId: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface Topping {
  id: number;
  name: string;
  price: number;
}

export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
}

export type OrderStatus = 'WAITING' | 'ACCEPTED' | 'READY' | 'COMPLETED' | 'CANCELED';
