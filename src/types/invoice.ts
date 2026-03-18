// 发票状态枚举
export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

// 发票明细项
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

// 发票
export interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  customerId: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  taxRate: number
  total: number
  currency: string
  issueDate: string
  dueDate: string
  notes: string
  templateId: string
  createdAt: string
  updatedAt: string
}

// 发票创建输入
export type InvoiceInput = Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>

// 发票更新输入
export type InvoiceUpdate = Partial<Omit<Invoice, 'id' | 'createdAt'>>