// 用户
export interface User {
  id: string
  email: string
  name: string
  company?: string
  logo?: string
  address?: string
  phone?: string
  taxId?: string
  bankName?: string
  bankAccount?: string
  createdAt: string
  updatedAt: string
}

// 用户设置
export interface UserSettings {
  defaultCurrency: string
  defaultTaxRate: number
  defaultPaymentTerms: number // 天数
  defaultTemplateId: string
}

// 用户输入
export type UserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>