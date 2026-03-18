import { getDB, generateId, now } from './db'
import type { Customer, CustomerInput, CustomerUpdate } from '@/types'

// 创建客户
export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const db = getDB()

  // 检查邮箱是否已存在
  const existing = await getCustomerByEmail(input.email)
  if (existing) {
    throw new Error(`Customer with email ${input.email} already exists`)
  }

  const customer: Customer = {
    ...input,
    id: generateId(),
    createdAt: now(),
    updatedAt: now()
  }

  await db.add('customers', customer)
  return customer
}

// 获取所有客户
export async function getAllCustomers(): Promise<Customer[]> {
  const db = getDB()
  const customers = await db.getAll('customers')
  return customers.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// 根据ID获取客户
export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const db = getDB()
  return db.get('customers', id)
}

// 根据邮箱获取客户
export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const db = getDB()
  return db.getFromIndex('customers', 'by-email', email)
}

// 更新客户
export async function updateCustomer(id: string, update: CustomerUpdate): Promise<Customer> {
  const db = getDB()
  const existing = await getCustomerById(id)

  if (!existing) {
    throw new Error(`Customer not found: ${id}`)
  }

  const updated: Customer = {
    ...existing,
    ...update,
    updatedAt: now()
  }

  await db.put('customers', updated)
  return updated
}

// 删除客户
export async function deleteCustomer(id: string): Promise<void> {
  const db = getDB()
  await db.delete('customers', id)
}

// 搜索客户
export async function searchCustomers(query: string): Promise<Customer[]> {
  const customers = await getAllCustomers()
  const lowerQuery = query.toLowerCase()

  return customers.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.email.toLowerCase().includes(lowerQuery) ||
    c.company?.toLowerCase().includes(lowerQuery)
  )
}