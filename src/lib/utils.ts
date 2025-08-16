
export const generateOrderId = (): string => {
  const now = new Date()
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "")
  const timeStr = String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0")
  const randomNum = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")
  return `GOGO-${dateStr}-${timeStr}${randomNum}`
}