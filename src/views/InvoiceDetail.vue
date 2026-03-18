<template>
  <div class="max-w-4xl mx-auto">
    <n-spin :show="loading">
      <n-card v-if="invoice">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-medium">{{ invoice.invoiceNumber }}</h3>
              <n-tag :type="statusType" size="small" class="mt-1">{{ statusLabel }}</n-tag>
            </div>
            <div class="flex gap-2">
              <n-button @click="handleDownload">下载PDF</n-button>
              <n-button @click="handlePrint">打印</n-button>
              <n-button type="primary" @click="showStatusModal = true">更新状态</n-button>
            </div>
          </div>
        </template>

        <!-- 发票信息 -->
        <n-descriptions label-placement="left" :column="2" bordered>
          <n-descriptions-item label="发票编号">{{ invoice.invoiceNumber }}</n-descriptions-item>
          <n-descriptions-item label="状态">
            <n-tag :type="statusType">{{ statusLabel }}</n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="开票日期">{{ invoice.issueDate }}</n-descriptions-item>
          <n-descriptions-item label="到期日期">{{ invoice.dueDate }}</n-descriptions-item>
        </n-descriptions>

        <!-- 客户信息 -->
        <n-divider>客户信息</n-divider>
        <n-descriptions v-if="customer" label-placement="left" :column="2" bordered>
          <n-descriptions-item label="客户名称">{{ customer.name }}</n-descriptions-item>
          <n-descriptions-item label="邮箱">{{ customer.email }}</n-descriptions-item>
          <n-descriptions-item label="公司">{{ customer.company || '-' }}</n-descriptions-item>
          <n-descriptions-item label="地址">{{ customer.address || '-' }}</n-descriptions-item>
        </n-descriptions>

        <!-- 商品明细 -->
        <n-divider>商品明细</n-divider>
        <n-data-table
          :columns="itemColumns"
          :data="invoice.items"
          :bordered="false"
        />

        <!-- 合计 -->
        <n-divider />
        <div class="flex justify-end">
          <div class="w-64 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">小计:</span>
              <span>{{ formatCurrency(invoice.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">税费 ({{ (invoice.taxRate * 100).toFixed(0) }}%):</span>
              <span>{{ formatCurrency(invoice.tax) }}</span>
            </div>
            <n-divider style="margin: 8px 0" />
            <div class="flex justify-between text-lg font-bold">
              <span>总计:</span>
              <span class="text-indigo-600">{{ formatCurrency(invoice.total) }}</span>
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <template v-if="invoice.notes">
          <n-divider>备注</n-divider>
          <p class="text-gray-600">{{ invoice.notes }}</p>
        </template>
      </n-card>
    </n-spin>

    <!-- 更新状态弹窗 -->
    <n-modal v-model:show="showStatusModal" preset="card" title="更新状态" style="width: 400px">
      <n-radio-group v-model:value="newStatus">
        <n-space vertical>
          <n-radio value="draft">草稿</n-radio>
          <n-radio value="sent">已发送</n-radio>
          <n-radio value="paid">已收款</n-radio>
          <n-radio value="overdue">已逾期</n-radio>
          <n-radio value="cancelled">已取消</n-radio>
        </n-space>
      </n-radio-group>
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="showStatusModal = false">取消</n-button>
          <n-button type="primary" @click="handleUpdateStatus">确定</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard, NSpin, NTag, NButton, NDescriptions, NDescriptionsItem, NDivider,
  NDataTable, NModal, NRadioGroup, NRadio, NSpace
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useInvoiceStore, useCustomerStore, useTemplateStore, useUserStore } from '@/stores'
import { getCustomerById, generateInvoicePDF, downloadPDF, printPDF } from '@/services'
import type { Invoice, InvoiceItem, Customer, InvoiceStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const invoiceStore = useInvoiceStore()
const customerStore = useCustomerStore()
const templateStore = useTemplateStore()
const userStore = useUserStore()

const loading = ref(true)
const showStatusModal = ref(false)
const newStatus = ref<InvoiceStatus>('draft')

const invoice = computed(() => invoiceStore.currentInvoice)
const customer = ref<Customer | null>(null)

const statusMap: Record<string, { type: 'default' | 'info' | 'success' | 'warning' | 'error', label: string }> = {
  draft: { type: 'default', label: '草稿' },
  sent: { type: 'info', label: '已发送' },
  paid: { type: 'success', label: '已收款' },
  overdue: { type: 'warning', label: '已逾期' },
  cancelled: { type: 'error', label: '已取消' }
}

const statusType = computed(() => statusMap[invoice.value?.status || 'draft']?.type || 'default')
const statusLabel = computed(() => statusMap[invoice.value?.status || 'draft']?.label || '草稿')

const itemColumns: DataTableColumns<InvoiceItem> = [
  { title: '商品名称', key: 'description' },
  { title: '数量', key: 'quantity' },
  {
    title: '单价',
    key: 'unitPrice',
    render(row) {
      return formatCurrency(row.unitPrice)
    }
  },
  {
    title: '金额',
    key: 'amount',
    render(row) {
      return formatCurrency(row.amount)
    }
  }
]

function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

async function handleDownload() {
  if (!invoice.value || !customer.value) return

  const template = await templateStore.templates.find(t => t.id === invoice.value?.templateId)
    || templateStore.defaultTemplate

  if (!template || !userStore.user) return

  const blob = await generateInvoicePDF(
    invoice.value,
    customer.value,
    userStore.user,
    template
  )

  downloadPDF(blob, `${invoice.value.invoiceNumber}.pdf`)
}

async function handlePrint() {
  if (!invoice.value || !customer.value) return

  const template = await templateStore.templates.find(t => t.id === invoice.value?.templateId)
    || templateStore.defaultTemplate

  if (!template || !userStore.user) return

  const blob = await generateInvoicePDF(
    invoice.value,
    customer.value,
    userStore.user,
    template
  )

  printPDF(blob)
}

async function handleUpdateStatus() {
  if (!invoice.value) return

  await invoiceStore.updateStatus(invoice.value.id, newStatus.value)
  showStatusModal.value = false
}

onMounted(async () => {
  const id = route.params.id as string

  await Promise.all([
    invoiceStore.fetchInvoice(id),
    customerStore.fetchCustomers(),
    templateStore.fetchTemplates(),
    userStore.fetchUser()
  ])

  if (invoice.value) {
    newStatus.value = invoice.value.status
    customer.value = await getCustomerById(invoice.value.customerId) || null
  }

  loading.value = false
})
</script>