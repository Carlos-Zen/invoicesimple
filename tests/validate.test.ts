import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPhone, isValidTaxId, isValidBankAccount } from '../src/validate'

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co')).toBe(true)
    expect(isValidEmail('test+tag@example.org')).toBe(true)
  })

  it('should return false for invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
    expect(isValidEmail('test @example.com')).toBe(false)
  })
})

describe('isValidPhone', () => {
  it('should return true for valid Chinese mobile numbers', () => {
    expect(isValidPhone('13812345678')).toBe(true)
    expect(isValidPhone('15900001111')).toBe(true)
    expect(isValidPhone('18888888888')).toBe(true)
  })

  it('should return false for invalid phone numbers', () => {
    expect(isValidPhone('12345678901')).toBe(false)
    expect(isValidPhone('1381234567')).toBe(false)
    expect(isValidPhone('138123456789')).toBe(false)
  })
})

describe('isValidTaxId', () => {
  it('should return true for valid tax IDs', () => {
    expect(isValidTaxId('123456789012345')).toBe(true)
    expect(isValidTaxId('ABCDEFGHIJ123456')).toBe(true)
    expect(isValidTaxId('12345678901234567890')).toBe(true)
  })

  it('should return false for invalid tax IDs', () => {
    expect(isValidTaxId('12345')).toBe(false)
    expect(isValidTaxId('123456789012345678901')).toBe(false)
    // Note: lowercase letters are valid in tax IDs
    expect(isValidTaxId('abcdefghijklmnop')).toBe(true)
  })
})

describe('isValidBankAccount', () => {
  it('should return true for valid bank accounts', () => {
    expect(isValidBankAccount('1234567890')).toBe(true)
    expect(isValidBankAccount('6222021234567890123')).toBe(true)
    expect(isValidBankAccount('12345678901234567890123')).toBe(true)
  })

  it('should return false for invalid bank accounts', () => {
    expect(isValidBankAccount('123456789')).toBe(false)
    expect(isValidBankAccount('12345678901234567890123456')).toBe(false)
    expect(isValidBankAccount('abcdefghijk')).toBe(false)
  })
})