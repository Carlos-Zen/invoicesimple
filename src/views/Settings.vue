<template>
  <div class="max-w-2xl mx-auto">
    <n-card title="公司信息">
      <n-form
        ref="formRef"
        :model="formData"
        label-placement="left"
        label-width="100"
      >
        <n-form-item label="公司名称">
          <n-input v-model:value="formData.company" placeholder="您的公司名称" />
        </n-form-item>

        <n-form-item label="联系人">
          <n-input v-model:value="formData.name" placeholder="联系人姓名" />
        </n-form-item>

        <n-form-item label="邮箱">
          <n-input v-model:value="formData.email" placeholder="联系邮箱" />
        </n-form-item>

        <n-form-item label="电话">
          <n-input v-model:value="formData.phone" placeholder="联系电话" />
        </n-form-item>

        <n-form-item label="地址">
          <n-input v-model:value="formData.address" placeholder="公司地址" />
        </n-form-item>

        <n-form-item label="税号">
          <n-input v-model:value="formData.taxId" placeholder="纳税人识别号" />
        </n-form-item>

        <n-divider>银行信息</n-divider>

        <n-form-item label="开户银行">
          <n-input v-model:value="formData.bankName" placeholder="开户银行" />
        </n-form-item>

        <n-form-item label="银行账号">
          <n-input v-model:value="formData.bankAccount" placeholder="银行账号" />
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="flex justify-end">
          <n-button type="primary" @click="handleSave">保存设置</n-button>
        </div>
      </template>
    </n-card>

    <n-card title="默认设置" class="mt-4">
      <n-form label-placement="left" label-width="100">
        <n-form-item label="默认货币">
          <n-select
            v-model:value="settings.defaultCurrency"
            :options="currencyOptions"
            class="w-48"
          />
        </n-form-item>

        <n-form-item label="默认税率">
          <n-input-number
            v-model:value="settings.defaultTaxRate"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            class="w-32"
          />
          <span class="ml-2 text-gray-500">{{ (settings.defaultTaxRate * 100).toFixed(0) }}%</span>
        </n-form-item>

        <n-form-item label="付款期限">
          <n-input-number
            v-model:value="settings.defaultPaymentTerms"
            :min="0"
            :max="365"
            class="w-32"
          />
          <span class="ml-2 text-gray-500">天</span>
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="flex justify-end">
          <n-button type="primary" @click="handleSaveSettings">保存设置</n-button>
        </div>
      </template>
    </n-card>

    <!-- 数据管理 -->
    <n-card title="数据管理" class="mt-4">
      <n-space>
        <n-button @click="handleExport">导出数据</n-button>
        <n-button @click="handleImport">导入数据</n-button>
        <n-button type="error" @click="handleClearData">清除所有数据</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NButton,
  NDivider, NSpace, useMessage, useDialog
} from 'naive-ui'
import { useUserStore } from '@/stores'
import { getDB } from '@/services'

const message = useMessage()
const dialog = useDialog()
const userStore = useUserStore()

const formRef = ref()

const formData = reactive({
  company: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  taxId: '',
  bankName: '',
  bankAccount: ''
})

const settings = reactive({
  defaultCurrency: 'CNY',
  defaultTaxRate: 0.06,
  defaultPaymentTerms: 30
})

const currencyOptions = [
  { label: '人民币 (CNY)', value: 'CNY' },
  { label: '美元 (USD)', value: 'USD' },
  { label: '欧元 (EUR)', value: 'EUR' }
]

async function handleSave() {
  await userStore.saveUser(formData)
  message.success('保存成功')
}

function handleSaveSettings() {
  userStore.updateSettings(settings)
  message.success('设置已保存')
}

async function handleExport() {
  const db = getDB()
  const data = {
    users: await db.getAll('users'),
    customers: await db.getAll('customers'),
    invoices: await db.getAll('invoices'),
    templates: await db.getAll('templates'),
    exportDate: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `invoicesimple-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  message.success('数据导出成功')
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const text = await file.text()
    const data = JSON.parse(text)

    const db = getDB()

    // 清除现有数据
    await db.clear('users')
    await db.clear('customers')
    await db.clear('invoices')
    await db.clear('templates')

    // 导入新数据
    for (const user of data.users || []) {
      await db.add('users', user)
    }
    for (const customer of data.customers || []) {
      await db.add('customers', customer)
    }
    for (const invoice of data.invoices || []) {
      await db.add('invoices', invoice)
    }
    for (const template of data.templates || []) {
      await db.add('templates', template)
    }

    message.success('数据导入成功，请刷新页面')
  }

  input.click()
}

function handleClearData() {
  dialog.warning({
    title: '确认清除',
    content: '此操作将清除所有数据，且不可恢复。确定要继续吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const db = getDB()
      await db.clear('users')
      await db.clear('customers')
      await db.clear('invoices')
      await db.clear('templates')

      message.success('数据已清除，请刷新页面')
    }
  })
}

onMounted(() => {
  if (userStore.user) {
    Object.assign(formData, userStore.user)
  }

  userStore.loadSettings()
  Object.assign(settings, userStore.settings)
})
</script>