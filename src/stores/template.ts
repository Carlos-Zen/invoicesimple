import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Template } from '@/types'
import {
  getAllTemplates,
  getTemplateById,
  getDefaultTemplate,
  setDefaultTemplate,
  initDefaultTemplates
} from '@/services'

export const useTemplateStore = defineStore('template', () => {
  // State
  const templates = ref<Template[]>([])
  const currentTemplate = ref<Template | null>(null)
  const loading = ref(false)

  // Getters
  const defaultTemplate = computed(() =>
    templates.value.find(t => t.isDefault) || templates.value[0]
  )

  const templateOptions = computed(() =>
    templates.value.map(t => ({
      label: t.name,
      value: t.id,
      template: t
    }))
  )

  // Actions
  async function fetchTemplates() {
    loading.value = true
    try {
      // 确保默认模板已初始化
      await initDefaultTemplates()
      templates.value = await getAllTemplates()
    } finally {
      loading.value = false
    }
  }

  async function fetchTemplate(id: string) {
    loading.value = true
    try {
      currentTemplate.value = await getTemplateById(id) || null
    } finally {
      loading.value = false
    }
  }

  async function setDefault(id: string) {
    await setDefaultTemplate(id)
    templates.value = templates.value.map(t => ({
      ...t,
      isDefault: t.id === id
    }))
  }

  return {
    // State
    templates,
    currentTemplate,
    loading,
    // Getters
    defaultTemplate,
    templateOptions,
    // Actions
    fetchTemplates,
    fetchTemplate,
    setDefault
  }
})