/**
 * 计算单个项目的金额
 */
export function calculateItemAmount(quantity: number, unitPrice: number): number {
  const amount = quantity * unitPrice
  return Math.round(amount * 100) / 100 // 保留两位小数
}

/**
 * 计算发票总计
 */
export function calculateInvoiceTotal(
  items: Array<{ quantity: number; unitPrice: number }>,
  taxRate: number
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    return sum + calculateItemAmount(item.quantity, item.unitPrice)
  }, 0)

  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  return { subtotal, tax, total }
}