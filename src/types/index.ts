// Common string literal types
export type OrderStatus = "WAITING" | "IN_PROGRESS" | "READY" | "COMPLETED" | "CANCELED"
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "ONLINE_BANKING" | "QR_CODE"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

// Base interfaces for common properties
interface BaseEntity {
  id: number
  is_available?: boolean
}

interface BaseWithTimestamps {
  created_at: string
  updated_at: string
}

// User related interfaces
export interface Role extends BaseEntity {
  name: string
}

export interface User extends BaseEntity {
  first_name: string
  last_name: string
  phone_number?: string
  role_id: Role
  is_active: boolean
}

// Menu related interfaces
export interface MenuCategory extends BaseEntity {
  name: string
}

export interface MenuItem extends BaseEntity {
  name: string
  description?: string
  base_price: number
  category_id: number
  image_url?: string
  is_available: boolean
}

export interface Topping extends BaseEntity {
  name: string
  price: number
  is_available: boolean
}

// Order related interfaces
export interface OrderItem extends BaseEntity {
  menu_item: MenuItem
  toppings: Topping[]
  quantity: number
  total_price: number
  sugar_level?: number // 0-100 (% ความหวานต่อแก้ว)
}

export interface OrderTopping extends BaseEntity, BaseWithTimestamps {
  order_item_id: number
  topping_id: number
  quantity: number
  price: number
  topping?: Topping
}

export interface Order {
  id: string
  User: User
  total_amount: number
  order_status: OrderStatus
  payment_method?: PaymentMethod
  payment_status?: PaymentStatus
  notes?: string
  order_time: Date
  completed_time?: Date
  items: OrderItem[]
}

export interface Payment extends BaseEntity, BaseWithTimestamps {
  order_id: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  amount: number
  transaction_id?: string
  payment_time: string
}

export interface CartItem extends Omit<OrderItem, 'id'> {
  id: number
  notes?: string
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    menu_item: MenuItem
    toppings: (OrderTopping & { topping: Topping })[]
  })[]
}