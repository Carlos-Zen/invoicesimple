// 验证邮箱
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证电话
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 验证税号
export function isValidTaxId(taxId: string): boolean {
  const taxIdRegex = /^[0-9A-Z]{15,20}$/
  return taxIdRegex.test(taxId)
}

// 验证银行账号
export function isValidBankAccount(account: string): boolean {
  const accountRegex = /^\d{10,25}$/
  return accountRegex.test(account)
}

// 表单验证规则
export const validationRules = {
  required: (message = '此字段为必填项') => ({
    required: true,
    message,
    trigger: 'blur' as const
  }),
  email: (message = '请输入有效的邮箱地址') => ({
    validator: (rule: unknown, value: string) => {
      if (!value) return true
      return isValidEmail(value)
    },
    message,
    trigger: 'blur' as const
  }),
  phone: (message = '请输入有效的手机号码') => ({
    validator: (rule: unknown, value: string) => {
      if (!value) return true
      return isValidPhone(value)
    },
    message,
    trigger: 'blur' as const
  })
}