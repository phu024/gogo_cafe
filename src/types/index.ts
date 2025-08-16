export type OrderStatus = "UN_PAYMENT" | "PENDING" | "IN_PROGRESS" | "READY" | "COMPLETED" | "CANCELED"
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "ONLINE_BANKING" | "QR_CODE"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  phone_number?: string
  role_id: Role
  is_active: boolean

}

export interface MenuCategory {
  id: number
  name: string
}

export interface MenuItem {
  id: number
  name: string
  description?: string
  base_price: number
  category_id: number
  image_url?: string
  is_available: boolean
}

export interface Topping {
  id: number
  name: string
  price: number
  is_available: boolean
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

export interface OrderItem {
  id: number
  menu_item: MenuItem
  toppings: Topping[]
  quantity: number
  total_price: number
  sugar_level?: number // 0-100 (% ความหวานต่อแก้ว)
}

export interface OrderTopping {
  id: number
  order_item_id: number
  topping_id: number
  quantity: number
  price: number
  topping?: Topping
  created_at: string
  updated_at: string
}

export interface Payment {
  id: number
  order_id: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  amount: number
  transaction_id?: string
  payment_time: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  menu_item: MenuItem
  toppings: Topping[]
  quantity: number
  notes?: string
  total_price: number
  sugar_level?: number // 0-100
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    menu_item: MenuItem
    toppings: (OrderTopping & { topping: Topping })[]
  })[]
}