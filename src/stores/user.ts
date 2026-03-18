import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserSettings } from '@/types'
import { getDB, generateId, now } from '@/services'

const DEFAULT_SETTINGS: UserSettings = {
  defaultCurrency: 'CNY',
  defaultTaxRate: 0.06,
  defaultPaymentTerms: 30,
  defaultTemplateId: ''
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const settings = ref<UserSettings>({ ...DEFAULT_SETTINGS })
  const loading = ref(false)

  // Actions
  async function fetchUser() {
    loading.value = true
    try {
      const db = getDB()
      const users = await db.getAll('users')
      if (users.length > 0) {
        user.value = users[0]
      }
    } finally {
      loading.value = false
    }
  }

  async function saveUser(data: Partial<User>) {
    const db = getDB()

    if (user.value) {
      // 更新现有用户
      const updated: User = {
        ...user.value,
        ...data,
        updatedAt: now()
      }
      await db.put('users', updated)
      user.value = updated
    } else {
      // 创建新用户
      const newUser: User = {
        id: generateId(),
        email: data.email || '',
        name: data.name || '',
        company: data.company,
        logo: data.logo,
        address: data.address,
        phone: data.phone,
        taxId: data.taxId,
        bankName: data.bankName,
        bankAccount: data.bankAccount,
        createdAt: now(),
        updatedAt: now()
      }
      await db.add('users', newUser)
      user.value = newUser
    }
  }

  function updateSettings(newSettings: Partial<UserSettings>) {
    settings.value = {
      ...settings.value,
      ...newSettings
    }
    // 保存到 localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings.value))
  }

  function loadSettings() {
    const saved = localStorage.getItem('userSettings')
    if (saved) {
      settings.value = {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved)
      }
    }
  }

  return {
    // State
    user,
    settings,
    loading,
    // Actions
    fetchUser,
    saveUser,
    updateSettings,
    loadSettings
  }
})