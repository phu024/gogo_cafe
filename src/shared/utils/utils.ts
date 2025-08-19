
export const generateOrderId = (): string => {
  const now = new Date()
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "")
  const timeStr = String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0")
  const randomNum = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")
  return `GOGO-${dateStr}-${timeStr}${randomNum}`
}

// Price utilities
import type { MenuItem, Topping } from '@/types'

export const calcItemUnitPrice = (item: MenuItem, toppings: Topping[]): number => {
  const toppingsPrice = toppings.reduce((sum, t) => sum + t.price, 0)
  return item.base_price + toppingsPrice
}

export const calcItemTotalPrice = (item: MenuItem, toppings: Topping[], quantity: number): number => {
  return calcItemUnitPrice(item, toppings) * quantity
}

export const formatCurrencyTH = (value: number): string => {
  return value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}