import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invoice, InvoiceInput, InvoiceStatus } from '@/types'
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceStats,
  getInvoicesByStatus
} from '@/services'

export const useInvoiceStore = defineStore('invoice', () => {
  // State
  const invoices = ref<Invoice[]>([])
  const currentInvoice = ref<Invoice | null>(null)
  const loading = ref(false)
  const stats = ref({
    total: 0,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
    totalAmount: 0
  })

  // Getters
  const draftInvoices = computed(() =>
    invoices.value.filter(i => i.status === 'draft')
  )

  const sentInvoices = computed(() =>
    invoices.value.filter(i => i.status === 'sent')
  )

  const paidInvoices = computed(() =>
    invoices.value.filter(i => i.status === 'paid')
  )

  const overdueInvoices = computed(() =>
    invoices.value.filter(i => {
      if (i.status !== 'sent') return false
      return new Date(i.dueDate) < new Date()
    })
  )

  // Actions
  async function fetchInvoices() {
    loading.value = true
    try {
      invoices.value = await getAllInvoices()
      stats.value = await getInvoiceStats()
    } finally {
      loading.value = false
    }
  }

  async function fetchInvoice(id: string) {
    loading.value = true
    try {
      currentInvoice.value = await getInvoiceById(id) || null
    } finally {
      loading.value = false
    }
  }

  async function addInvoice(input: InvoiceInput) {
    const invoice = await createInvoice(input)
    invoices.value.unshift(invoice)
    stats.value = await getInvoiceStats()
    return invoice
  }

  async function editInvoice(id: string, data: Partial<Invoice>) {
    const invoice = await updateInvoice(id, data)
    const index = invoices.value.findIndex(i => i.id === id)
    if (index !== -1) {
      invoices.value[index] = invoice
    }
    if (currentInvoice.value?.id === id) {
      currentInvoice.value = invoice
    }
    stats.value = await getInvoiceStats()
    return invoice
  }

  async function removeInvoice(id: string) {
    await deleteInvoice(id)
    invoices.value = invoices.value.filter(i => i.id !== id)
    if (currentInvoice.value?.id === id) {
      currentInvoice.value = null
    }
    stats.value = await getInvoiceStats()
  }

  async function updateStatus(id: string, status: InvoiceStatus) {
    return editInvoice(id, { status })
  }

  async function fetchByStatus(status: InvoiceStatus) {
    return getInvoicesByStatus(status)
  }

  return {
    // State
    invoices,
    currentInvoice,
    loading,
    stats,
    // Getters
    draftInvoices,
    sentInvoices,
    paidInvoices,
    overdueInvoices,
    // Actions
    fetchInvoices,
    fetchInvoice,
    addInvoice,
    editInvoice,
    removeInvoice,
    updateStatus,
    fetchByStatus
  }
})