import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Invoice, Customer, Template, User } from '@/types'

// 数据库Schema定义
interface InvoiceDB extends DBSchema {
  users: {
    key: string
    value: User
  }
  customers: {
    key: string
    value: Customer
    indexes: {
      'by-name': string
      'by-email': string
      'by-company': string
    }
  }
  invoices: {
    key: string
    value: Invoice
    indexes: {
      'by-number': string
      'by-customer': string
      'by-status': string
      'by-date': string
    }
  }
  templates: {
    key: string
    value: Template
  }
}

const DB_NAME = 'invoice-simple'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<InvoiceDB> | null = null

// 初始化数据库
export async function initDB(): Promise<IDBPDatabase<InvoiceDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<InvoiceDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 用户存储
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' })
      }

      // 客户存储
      if (!db.objectStoreNames.contains('customers')) {
        const customerStore = db.createObjectStore('customers', { keyPath: 'id' })
        customerStore.createIndex('by-name', 'name')
        customerStore.createIndex('by-email', 'email')
        customerStore.createIndex('by-company', 'company')
      }

      // 发票存储
      if (!db.objectStoreNames.contains('invoices')) {
        const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id' })
        invoiceStore.createIndex('by-number', 'invoiceNumber')
        invoiceStore.createIndex('by-customer', 'customerId')
        invoiceStore.createIndex('by-status', 'status')
        invoiceStore.createIndex('by-date', 'issueDate')
      }

      // 模板存储
      if (!db.objectStoreNames.contains('templates')) {
        db.createObjectStore('templates', { keyPath: 'id' })
      }
    }
  })

  return dbInstance
}

// 获取数据库实例
export function getDB(): IDBPDatabase<InvoiceDB> {
  if (!dbInstance) throw new Error('Database not initialized')
  return dbInstance
}

// 生成UUID
export function generateId(): string {
  return crypto.randomUUID()
}

// 获取当前ISO时间
export function now(): string {
  return new Date().toISOString()
}