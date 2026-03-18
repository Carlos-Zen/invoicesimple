import { formatCurrency } from './format'

// 计算商品金额
export function calculateItemAmount(quantity: number, unitPrice: number): number {
  return Number((quantity * unitPrice).toFixed(2))
}

// 计算发票总额
export function calculateInvoiceTotal(
  items: { quantity: number; unitPrice: number }[],
  taxRate: number
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemAmount(item.quantity, item.unitPrice),
    0
  )
  const tax = Number((subtotal * taxRate).toFixed(2))
  const total = Number((subtotal + tax).toFixed(2))

  return { subtotal, tax, total }
}

// 计算税费
export function calculateTax(amount: number, taxRate: number): number {
  return Number((amount * taxRate).toFixed(2))
}

// 格式化金额显示
export function formatAmount(amount: number): string {
  return formatCurrency(amount)
}