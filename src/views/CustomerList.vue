<template>
  <div>
    <!-- 操作栏 -->
    <div class="flex justify-between mb-4">
      <n-input
        v-model:value="searchQuery"
        placeholder="搜索客户..."
        class="w-64"
        clearable
      >
        <template #prefix>
          <span>🔍</span>
        </template>
      </n-input>
      <n-button type="primary" @click="showAddModal = true">
        新增客户
      </n-button>
    </div>

    <!-- 客户列表 -->
    <n-card>
      <n-data-table
        :columns="columns"
        :data="filteredCustomers"
        :loading="loading"
        :bordered="false"
      />
    </n-card>

    <!-- 新增/编辑客户弹窗 -->
    <n-modal v-model:show="showAddModal" preset="card" :title="editingCustomer ? '编辑客户' : '新增客户'" style="width: 500px">
      <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80">
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="formData.name" placeholder="客户姓名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formData.email" placeholder="邮箱地址" />
        </n-form-item>
        <n-form-item label="电话">
          <n-input v-model:value="formData.phone" placeholder="电话（可选）" />
        </n-form-item>
        <n-form-item label="公司">
          <n-input v-model:value="formData.company" placeholder="公司名称（可选）" />
        </n-form-item>
        <n-form-item label="地址">
          <n-input v-model:value="formData.address" placeholder="地址（可选）" />
        </n-form-item>
        <n-form-item label="税号">
          <n-input v-model:value="formData.taxId" placeholder="纳税人识别号（可选）" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="closeModal">取消</n-button>
          <n-button type="primary" @click="handleSubmit">确定</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, h } from 'vue'
import {
  NCard, NInput, NButton, NDataTable, NModal, NForm, NFormItem, NTag, NSpace
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useCustomerStore } from '@/stores'
import type { Customer } from '@/types'

const customerStore = useCustomerStore()

const loading = ref(false)
const searchQuery = ref('')
const showAddModal = ref(false)
const editingCustomer = ref<Customer | null>(null)

const formRef = ref()
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  taxId: ''
})

const rules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customerStore.customers

  const query = searchQuery.value.toLowerCase()
  return customerStore.customers.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.email.toLowerCase().includes(query) ||
    c.company?.toLowerCase().includes(query)
  )
})

const columns: DataTableColumns<Customer> = [
  {
    title: '姓名',
    key: 'name',
    render(row) {
      return h('span', { class: 'font-medium' }, row.name)
    }
  },
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '公司',
    key: 'company',
    render(row) {
      return row.company || '-'
    }
  },
  {
    title: '电话',
    key: 'phone',
    render(row) {
      return row.phone || '-'
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render(row) {
      return h(NSpace, null, () => [
        h(NButton, {
          text: true,
          type: 'primary',
          onClick: () => handleEdit(row)
        }, () => '编辑'),
        h(NButton, {
          text: true,
          type: 'error',
          onClick: () => handleDelete(row)
        }, () => '删除')
      ])
    }
  }
]

function handleEdit(customer: Customer) {
  editingCustomer.value = customer
  formData.name = customer.name
  formData.email = customer.email
  formData.phone = customer.phone || ''
  formData.company = customer.company || ''
  formData.address = customer.address || ''
  formData.taxId = customer.taxId || ''
  showAddModal.value = true
}

async function handleDelete(customer: Customer) {
  await customerStore.removeCustomer(customer.id)
}

function closeModal() {
  showAddModal.value = false
  editingCustomer.value = null
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.company = ''
  formData.address = ''
  formData.taxId = ''
}

async function handleSubmit() {
  await formRef.value?.validate()

  const data = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone || undefined,
    company: formData.company || undefined,
    address: formData.address || undefined,
    taxId: formData.taxId || undefined
  }

  if (editingCustomer.value) {
    await customerStore.editCustomer(editingCustomer.value.id, data)
  } else {
    await customerStore.addCustomer(data)
  }

  closeModal()
}

onMounted(async () => {
  loading.value = true
  await customerStore.fetchCustomers()
  loading.value = false
})
</script>