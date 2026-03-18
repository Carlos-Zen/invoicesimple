import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer, CustomerInput } from '@/types'
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers
} from '@/services'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const loading = ref(false)

  // Getters
  const customerOptions = computed(() =>
    customers.value.map(c => ({
      label: c.name,
      value: c.id,
      customer: c
    }))
  )

  // Actions
  async function fetchCustomers() {
    loading.value = true
    try {
      customers.value = await getAllCustomers()
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomer(id: string) {
    loading.value = true
    try {
      currentCustomer.value = await getCustomerById(id) || null
    } finally {
      loading.value = false
    }
  }

  async function addCustomer(input: CustomerInput) {
    const customer = await createCustomer(input)
    customers.value.unshift(customer)
    return customer
  }

  async function editCustomer(id: string, data: Partial<Customer>) {
    const customer = await updateCustomer(id, data)
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value[index] = customer
    }
    if (currentCustomer.value?.id === id) {
      currentCustomer.value = customer
    }
    return customer
  }

  async function removeCustomer(id: string) {
    await deleteCustomer(id)
    customers.value = customers.value.filter(c => c.id !== id)
    if (currentCustomer.value?.id === id) {
      currentCustomer.value = null
    }
  }

  async function search(query: string) {
    if (!query.trim()) {
      return customers.value
    }
    return searchCustomers(query)
  }

  return {
    // State
    customers,
    currentCustomer,
    loading,
    // Getters
    customerOptions,
    // Actions
    fetchCustomers,
    fetchCustomer,
    addCustomer,
    editCustomer,
    removeCustomer,
    search
  }
})