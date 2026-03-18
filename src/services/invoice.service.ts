import { getDB, generateId, now } from './db'
import type { Invoice, InvoiceInput, InvoiceUpdate, InvoiceStatus, InvoiceItem } from '@/types'

// 创建发票
export async function createInvoice(input: InvoiceInput): Promise<Invoice> {
  const db = getDB()
  const invoiceNumber = await generateInvoiceNumber()

  const invoice: Invoice = {
    ...input,
    id: generateId(),
    invoiceNumber,
    createdAt: now(),
    updatedAt: now()
  }

  await db.add('invoices', invoice)
  return invoice
}

// 获取所有发票
export async function getAllInvoices(): Promise<Invoice[]> {
  const db = getDB()
  const invoices = await db.getAll('invoices')
  return invoices.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// 根据ID获取发票
export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  const db = getDB()
  return db.get('invoices', id)
}

// 更新发票
export async function updateInvoice(id: string, update: InvoiceUpdate): Promise<Invoice> {
  const db = getDB()
  const existing = await getInvoiceById(id)

  if (!existing) {
    throw new Error(`Invoice not found: ${id}`)
  }

  const updated: Invoice = {
    ...existing,
    ...update,
    updatedAt: now()
  }

  await db.put('invoices', updated)
  return updated
}

// 删除发票
export async function deleteInvoice(id: string): Promise<void> {
  const db = getDB()
  await db.delete('invoices', id)
}

// 按状态筛选发票
export async function getInvoicesByStatus(status: InvoiceStatus): Promise<Invoice[]> {
  const db = getDB()
  return db.getAllFromIndex('invoices', 'by-status', status)
}

// 按客户筛选发票
export async function getInvoicesByCustomer(customerId: string): Promise<Invoice[]> {
  const db = getDB()
  return db.getAllFromIndex('invoices', 'by-customer', customerId)
}

// 生成发票号
async function generateInvoiceNumber(): Promise<string> {
  const db = getDB()
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  // 获取当月发票数量
  const allInvoices = await db.getAll('invoices')
  const monthInvoices = allInvoices.filter(inv => {
    const date = new Date(inv.issueDate)
    return date.getFullYear() === year && date.getMonth() === now.getMonth()
  })

  const count = monthInvoices.length + 1
  return `INV-${year}${month}-${String(count).padStart(4, '0')}`
}

// 计算发票金额
export function calculateInvoiceItems(items: Omit<InvoiceItem, 'id' | 'amount'>[]): {
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
} {
  const itemsWithAmount: InvoiceItem[] = items.map((item, index) => ({
    id: generateId(),
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: Number((item.quantity * item.unitPrice).toFixed(2))
  }))

  const subtotal = Number(itemsWithAmount.reduce((sum, item) => sum + item.amount, 0).toFixed(2))

  return {
    items: itemsWithAmount,
    subtotal,
    tax: 0, // 税额在创建时根据税率计算
    total: subtotal
  }
}

// 统计发票
export async function getInvoiceStats(): Promise<{
  total: number
  draft: number
  sent: number
  paid: number
  overdue: number
  totalAmount: number
}> {
  const invoices = await getAllInvoices()
  const now = new Date()

  return {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i =>
      i.status === 'sent' && new Date(i.dueDate) < now
    ).length,
    totalAmount: invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0)
  }
}