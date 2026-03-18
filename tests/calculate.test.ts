import { describe, it, expect, beforeEach } from 'vitest'
import { calculateInvoiceTotal, calculateItemAmount } from '../calculate'

describe('calculateItemAmount', () => {
  it('should calculate item amount correctly', () => {
    expect(calculateItemAmount(2, 100)).toBe(200)
    expect(calculateItemAmount(3, 33.33)).toBe(99.99)
    expect(calculateItemAmount(1, 0)).toBe(0)
  })

  it('should handle decimal precision', () => {
    expect(calculateItemAmount(1, 33.333)).toBe(33.33)
    expect(calculateItemAmount(3, 33.33)).toBe(99.99)
  })
})

describe('calculateInvoiceTotal', () => {
  it('should calculate invoice total correctly', () => {
    const items = [
      { quantity: 2, unitPrice: 100 },
      { quantity: 1, unitPrice: 50 }
    ]
    const result = calculateInvoiceTotal(items, 0.06)

    expect(result.subtotal).toBe(250)
    expect(result.tax).toBe(15)
    expect(result.total).toBe(265)
  })

  it('should handle zero tax rate', () => {
    const items = [
      { quantity: 1, unitPrice: 100 }
    ]
    const result = calculateInvoiceTotal(items, 0)

    expect(result.subtotal).toBe(100)
    expect(result.tax).toBe(0)
    expect(result.total).toBe(100)
  })

  it('should handle empty items', () => {
    const result = calculateInvoiceTotal([], 0.06)

    expect(result.subtotal).toBe(0)
    expect(result.tax).toBe(0)
    expect(result.total).toBe(0)
  })
})