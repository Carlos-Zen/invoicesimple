/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证中国手机号格式
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证税号格式（15-20位字母或数字）
 */
export function isValidTaxId(taxId: string): boolean {
  const taxIdRegex = /^[A-Za-z0-9]{15,20}$/
  return taxIdRegex.test(taxId)
}

/**
 * 验证银行账号格式（10-24位数字）
 */
export function isValidBankAccount(account: string): boolean {
  const accountRegex = /^\d{10,24}$/
  return accountRegex.test(account)
}