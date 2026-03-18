// 客户
export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
  taxId?: string
  createdAt: string
  updatedAt: string
}

// 客户创建输入
export type CustomerInput = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>

// 客户更新输入
export type CustomerUpdate = Partial<Omit<Customer, 'id' | 'createdAt'>>