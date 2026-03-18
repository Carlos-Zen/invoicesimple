<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-4">
      <n-card class="text-center">
        <n-statistic label="总发票数" :value="stats.total">
          <template #prefix>
            <span class="text-2xl">📄</span>
          </template>
        </n-statistic>
      </n-card>

      <n-card class="text-center">
        <n-statistic label="待发送" :value="stats.draft" class="text-gray-600">
          <template #prefix>
            <span class="text-2xl">📝</span>
          </template>
        </n-statistic>
      </n-card>

      <n-card class="text-center">
        <n-statistic label="待收款" :value="stats.sent + stats.overdue">
          <template #prefix>
            <span class="text-2xl">💰</span>
          </template>
        </n-statistic>
      </n-card>

      <n-card class="text-center">
        <n-statistic label="已收款" :value="formatCurrency(stats.totalAmount)">
          <template #prefix>
            <span class="text-2xl">✅</span>
          </template>
        </n-statistic>
      </n-card>
    </div>

    <!-- 快捷操作 -->
    <n-card title="快捷操作">
      <div class="grid grid-cols-3 gap-4">
        <n-button
          size="large"
          type="primary"
          block
          @click="router.push('/invoices/create')"
        >
          <template #icon>
            <span>📝</span>
          </template>
          创建新发票
        </n-button>

        <n-button
          size="large"
          block
          @click="router.push('/customers')"
        >
          <template #icon>
            <span>👥</span>
          </template>
          管理客户
        </n-button>

        <n-button
          size="large"
          block
          @click="router.push('/templates')"
        >
          <template #icon>
            <span>🎨</span>
          </template>
          选择模板
        </n-button>
      </div>
    </n-card>

    <!-- 最近发票 -->
    <n-card title="最近发票">
      <template #header-extra>
        <n-button text @click="router.push('/invoices')">
          查看全部 →
        </n-button>
      </template>

      <n-data-table
        :columns="columns"
        :data="recentInvoices"
        :loading="loading"
        :bordered="false"
        size="small"
      />
    </n-card>

    <!-- 待收款提醒 -->
    <n-card v-if="overdueInvoices.length > 0" title="逾期提醒">
      <n-alert type="warning" class="mb-4">
        您有 {{ overdueInvoices.length }} 张发票已逾期未收款
      </n-alert>

      <n-list bordered>
        <n-list-item v-for="invoice in overdueInvoices" :key="invoice.id">
          <div class="flex justify-between items-center w-full">
            <div>
              <span class="font-medium">{{ invoice.invoiceNumber }}</span>
              <span class="text-gray-400 ml-2">到期: {{ invoice.dueDate }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-red-500 font-medium">{{ formatCurrency(invoice.total) }}</span>
              <n-button size="small" @click="router.push(`/invoices/${invoice.id}`)">
                查看
              </n-button>
            </div>
          </div>
        </n-list-item>
      </n-list>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard, NStatistic, NButton, NDataTable, NList, NListItem, NAlert, NTag
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useInvoiceStore } from '@/stores'
import type { Invoice } from '@/types'

const router = useRouter()
const invoiceStore = useInvoiceStore()

const loading = ref(false)
const stats = computed(() => invoiceStore.stats)
const recentInvoices = computed(() => invoiceStore.invoices.slice(0, 5))
const overdueInvoices = computed(() => invoiceStore.overdueInvoices)

const columns: DataTableColumns<Invoice> = [
  {
    title: '发票号',
    key: 'invoiceNumber',
    render(row) {
      return h('a', {
        class: 'text-indigo-600 hover:underline cursor-pointer',
        onClick: () => router.push(`/invoices/${row.id}`)
      }, row.invoiceNumber)
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      const statusMap: Record<string, { type: 'default' | 'info' | 'success' | 'warning' | 'error', label: string }> = {
        draft: { type: 'default', label: '草稿' },
        sent: { type: 'info', label: '已发送' },
        paid: { type: 'success', label: '已收款' },
        overdue: { type: 'warning', label: '已逾期' },
        cancelled: { type: 'error', label: '已取消' }
      }
      const status = statusMap[row.status] || statusMap.draft
      return h(NTag, { type: status.type, size: 'small' }, () => status.label)
    }
  },
  {
    title: '金额',
    key: 'total',
    render(row) {
      return formatCurrency(row.total)
    }
  },
  {
    title: '开票日期',
    key: 'issueDate'
  },
  {
    title: '到期日期',
    key: 'dueDate'
  }
]

function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

onMounted(async () => {
  loading.value = true
  await invoiceStore.fetchInvoices()
  loading.value = false
})
</script>