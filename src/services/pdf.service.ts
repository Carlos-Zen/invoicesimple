import jsPDF from 'jspdf'
import type { Invoice, Customer, User, Template } from '@/types'

// 生成发票PDF
export async function generateInvoicePDF(
  invoice: Invoice,
  customer: Customer,
  user: User,
  template: Template
): Promise<Blob> {
  const doc = new jsPDF()
  const config = template.config
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // 设置字体
  doc.setFont('helvetica')

  // === 页眉 ===
  // 公司名称
  doc.setFontSize(22)
  doc.setTextColor(config.primaryColor)
  doc.text(user.company || '发票', margin, 25)

  // 发票标题
  doc.setFontSize(16)
  doc.text('发票 / INVOICE', pageWidth - margin, 25, { align: 'right' })

  // 分隔线
  doc.setDrawColor(config.primaryColor)
  doc.setLineWidth(0.5)
  doc.line(margin, 32, pageWidth - margin, 32)

  // === 发票信息 ===
  doc.setFontSize(10)
  doc.setTextColor('#666666')

  let y = 42
  doc.text(`发票编号: ${invoice.invoiceNumber}`, margin, y)
  doc.text(`开票日期: ${formatDate(invoice.issueDate)}`, margin, y + 6)
  doc.text(`到期日期: ${formatDate(invoice.dueDate)}`, margin, y + 6 * 2)

  // === 客户信息 ===
  doc.setFontSize(11)
  doc.setTextColor('#333333')
  doc.text('客户信息:', margin, y + 25)

  doc.setFontSize(10)
  doc.setTextColor('#666666')
  doc.text(customer.name, margin, y + 32)
  if (customer.company) {
    doc.text(customer.company, margin, y + 38)
  }
  if (customer.address) {
    doc.text(customer.address, margin, y + 44)
  }
  if (customer.email) {
    doc.text(customer.email, margin, y + 50)
  }

  // === 商品明细表格 ===
  y = 110

  // 表头
  doc.setFillColor(config.primaryColor)
  doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F')

  doc.setTextColor('#ffffff')
  doc.setFontSize(10)
  doc.text('商品名称', margin + 2, y)
  doc.text('数量', margin + 80, y)
  doc.text('单价', margin + 105, y)
  doc.text('金额', margin + 140, y)

  // 表格内容
  doc.setTextColor('#333333')
  invoice.items.forEach((item, index) => {
    const rowY = y + 10 + index * 8
    doc.text(truncate(item.description, 35), margin + 2, rowY)
    doc.text(String(item.quantity), margin + 80, rowY)
    doc.text(formatCurrency(item.unitPrice), margin + 105, rowY)
    doc.text(formatCurrency(item.amount), margin + 140, rowY)
  })

  // === 合计区域 ===
  const totalY = y + 20 + invoice.items.length * 8

  doc.setFontSize(10)
  doc.setTextColor('#333333')
  doc.text(`小计:`, margin + 110, totalY)
  doc.text(formatCurrency(invoice.subtotal), margin + 140, totalY)

  if (config.showTax && invoice.tax > 0) {
    doc.text(`税费 (${invoice.taxRate * 100}%):`, margin + 110, totalY + 6)
    doc.text(formatCurrency(invoice.tax), margin + 140, totalY + 6)
  }

  // 总计
  doc.setFontSize(14)
  doc.setTextColor(config.primaryColor)
  const finalY = config.showTax ? totalY + 16 : totalY + 10
  doc.text(`总计: ${formatCurrency(invoice.total)}`, margin + 110, finalY)

  // === 备注 ===
  if (config.showNotes && invoice.notes) {
    const notesY = finalY + 15
    doc.setFontSize(9)
    doc.setTextColor('#666666')
    doc.text('备注:', margin, notesY)
    doc.text(invoice.notes, margin, notesY + 5)
  }

  // === 页脚 ===
  if (user.company || user.address || user.phone) {
    doc.setFontSize(8)
    doc.setTextColor('#999999')

    const footerParts = [
      user.company,
      user.address,
      user.phone ? `电话: ${user.phone}` : null
    ].filter(Boolean)

    doc.text(footerParts.join(' | '), margin, 285)
  }

  // 生成时间戳
  doc.setFontSize(7)
  doc.setTextColor('#CCCCCC')
  doc.text(`生成于 ${new Date().toLocaleString('zh-CN')} | InvoiceSimple`, pageWidth / 2, 290, { align: 'center' })

  return doc.output('blob')
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化货币
function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

// 截断字符串
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - 3) + '...'
}

// 下载PDF
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 打印PDF
export function printPDF(blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}