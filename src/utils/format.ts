import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 日期格式化
export function formatDate(date: string | Date, formatStr = 'yyyy-MM-dd'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr, { locale: zhCN })
}

// 货币格式化
export function formatCurrency(amount: number, currency = 'CNY'): string {
  const symbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€'
  }
  return `${symbols[currency] || '¥'}${amount.toFixed(2)}`
}

// 生成发票号
export function generateInvoiceNumber(prefix = 'INV'): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `${prefix}-${year}${month}-${random}`
}

// 计算到期日期
export function calculateDueDate(issueDate: string, days: number): string {
  const date = new Date(issueDate)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

// 检查是否逾期
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}