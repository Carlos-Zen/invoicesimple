<template>
  <div class="max-w-4xl mx-auto">
    <n-card title="创建发票">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <!-- 客户选择 -->
        <n-form-item label="客户" path="customerId">
          <n-select
            v-model:value="formData.customerId"
            :options="customerOptions"
            placeholder="选择客户"
            filterable
            @update:value="handleCustomerChange"
          />
          <n-button class="ml-2" @click="showAddCustomer = true">
            新增客户
          </n-button>
        </n-form-item>

        <!-- 发票日期 -->
        <div class="grid grid-cols-2 gap-4">
          <n-form-item label="开票日期" path="issueDate">
            <n-date-picker
              v-model:value="issueDateValue"
              type="date"
              class="w-full"
            />
          </n-form-item>

          <n-form-item label="到期日期" path="dueDate">
            <n-date-picker
              v-model:value="dueDateValue"
              type="date"
              class="w-full"
            />
          </n-form-item>
        </div>

        <!-- 商品明细 -->
        <n-form-item label="商品明细">
          <div class="w-full space-y-2">
            <div
              v-for="(item, index) in formData.items"
              :key="index"
              class="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded"
            >
              <div class="col-span-5">
                <n-input
                  v-model:value="item.description"
                  placeholder="商品名称"
                />
              </div>
              <div class="col-span-2">
                <n-input-number
                  v-model:value="item.quantity"
                  :min="1"
                  placeholder="数量"
                  class="w-full"
                  @update:value="calculateItemAmount(index)"
                />
              </div>
              <div class="col-span-2">
                <n-input-number
                  v-model:value="item.unitPrice"
                  :min="0"
                  :precision="2"
                  placeholder="单价"
                  class="w-full"
                  @update:value="calculateItemAmount(index)"
                />
              </div>
              <div class="col-span-2 text-right">
                <span class="font-medium">{{ formatCurrency(item.amount || 0) }}</span>
              </div>
              <div class="col-span-1 text-center">
                <n-button
                  text
                  type="error"
                  @click="removeItem(index)"
                  :disabled="formData.items.length === 1"
                >
                  删除
                </n-button>
              </div>
            </div>

            <n-button dashed block @click="addItem">
              + 添加商品
            </n-button>
          </div>
        </n-form-item>

        <!-- 税率 -->
        <n-form-item label="税率">
          <n-input-number
            v-model:value="formData.taxRate"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            class="w-32"
          />
          <span class="ml-2 text-gray-500">{{ (formData.taxRate * 100).toFixed(0) }}%</span>
        </n-form-item>

        <!-- 模板选择 -->
        <n-form-item label="模板">
          <n-select
            v-model:value="formData.templateId"
            :options="templateOptions"
            placeholder="选择模板"
          />
        </n-form-item>

        <!-- 备注 -->
        <n-form-item label="备注">
          <n-input
            v-model:value="formData.notes"
            type="textarea"
            placeholder="备注信息（可选）"
            :rows="3"
          />
        </n-form-item>

        <!-- 合计 -->
        <div class="bg-gray-50 p-4 rounded space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">小计:</span>
            <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">税费:</span>
            <span class="font-medium">{{ formatCurrency(tax) }}</span>
          </div>
          <n-divider />
          <div class="flex justify-between text-lg">
            <span class="font-medium">总计:</span>
            <span class="font-bold text-indigo-600">{{ formatCurrency(total) }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-4 mt-6">
          <n-button @click="router.back()">取消</n-button>
          <n-button type="primary" @click="handleSaveDraft">保存草稿</n-button>
          <n-button type="success" @click="handleSaveAndPreview">保存并预览</n-button>
        </div>
      </n-form>
    </n-card>

    <!-- 新增客户弹窗 -->
    <n-modal v-model:show="showAddCustomer" preset="card" title="新增客户" style="width: 500px">
      <n-form ref="customerFormRef" :model="customerForm" label-placement="left" label-width="80">
        <n-form-item label="姓名" required>
          <n-input v-model:value="customerForm.name" placeholder="客户姓名" />
        </n-form-item>
        <n-form-item label="邮箱" required>
          <n-input v-model:value="customerForm.email" placeholder="邮箱地址" />
        </n-form-item>
        <n-form-item label="公司">
          <n-input v-model:value="customerForm.company" placeholder="公司名称（可选）" />
        </n-form-item>
        <n-form-item label="地址">
          <n-input v-model:value="customerForm.address" placeholder="地址（可选）" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="showAddCustomer = false">取消</n-button>
          <n-button type="primary" @click="handleAddCustomer">确定</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NDatePicker,
  NButton, NDivider, NModal
} from 'naive-ui'
import { useCustomerStore, useTemplateStore, useInvoiceStore } from '@/stores'
import type { InvoiceItem } from '@/types'

const router = useRouter()
const customerStore = useCustomerStore()
const templateStore = useTemplateStore()
const invoiceStore = useInvoiceStore()

const formRef = ref()
const customerFormRef = ref()
const showAddCustomer = ref(false)

// 表单数据
const formData = reactive({
  customerId: '',
  status: 'draft' as const,
  items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
  taxRate: 0.06,
  currency: 'CNY',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notes: '',
  templateId: ''
})

const customerForm = reactive({
  name: '',
  email: '',
  company: '',
  address: ''
})

// 日期选择器值
const issueDateValue = ref(Date.now())
const dueDateValue = ref(Date.now() + 30 * 24 * 60 * 60 * 1000)

// 验证规则
const rules = {
  customerId: { required: true, message: '请选择客户', trigger: 'blur' }
}

// 客户选项
const customerOptions = computed(() => customerStore.customerOptions)

// 模板选项
const templateOptions = computed(() => templateStore.templateOptions)

// 计算金额
const subtotal = computed(() =>
  formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
)

const tax = computed(() => subtotal.value * formData.taxRate)

const total = computed(() => subtotal.value + tax.value)

// 方法
function calculateItemAmount(index: number) {
  const item = formData.items[index]
  item.amount = Number((item.quantity * item.unitPrice).toFixed(2))
}

function addItem() {
  formData.items.push({ description: '', quantity: 1, unitPrice: 0, amount: 0 })
}

function removeItem(index: number) {
  if (formData.items.length > 1) {
    formData.items.splice(index, 1)
  }
}

function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

function handleCustomerChange(id: string) {
  formData.customerId = id
}

async function handleAddCustomer() {
  if (!customerForm.name || !customerForm.email) return

  const customer = await customerStore.addCustomer({
    name: customerForm.name,
    email: customerForm.email,
    company: customerForm.company || undefined,
    address: customerForm.address || undefined
  })

  formData.customerId = customer.id
  showAddCustomer.value = false

  // 重置表单
  customerForm.name = ''
  customerForm.email = ''
  customerForm.company = ''
  customerForm.address = ''
}

async function handleSaveDraft() {
  await formRef.value?.validate()

  const invoice = await invoiceStore.addInvoice({
    ...formData,
    subtotal: subtotal.value,
    tax: tax.value,
    total: total.value
  })

  router.push(`/invoices/${invoice.id}`)
}

async function handleSaveAndPreview() {
  await handleSaveDraft()
}

onMounted(async () => {
  await Promise.all([
    customerStore.fetchCustomers(),
    templateStore.fetchTemplates()
  ])

  // 设置默认模板
  if (templateStore.defaultTemplate) {
    formData.templateId = templateStore.defaultTemplate.id
  }
})
</script>