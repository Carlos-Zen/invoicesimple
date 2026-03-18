<template>
  <n-layout has-sider class="h-screen">
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      :width="220"
      :native-scrollbar="false"
      class="bg-white"
    >
      <div class="p-4 border-b border-gray-100">
        <h1 class="text-xl font-bold text-indigo-600">InvoiceSimple</h1>
        <p class="text-xs text-gray-400 mt-1">极简发票生成器</p>
      </div>

      <n-menu
        :options="menuOptions"
        :value="currentKey"
        @update:value="handleMenuClick"
        class="py-2"
      />
    </n-layout-sider>

    <!-- 主内容区 -->
    <n-layout>
      <n-layout-header bordered class="px-6 py-4 bg-white">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-800">{{ pageTitle }}</h2>
          <div class="flex items-center gap-4">
            <n-button type="primary" @click="router.push('/invoices/create')">
              <template #icon>
                <n-icon><PlusOutlined /></n-icon>
              </template>
              创建发票
            </n-button>
          </div>
        </div>
      </n-layout-header>

      <n-layout-content class="p-6">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NButton, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

// 图标组件
const PlusOutlined = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      class: 'w-4 h-4'
    }, [
      h('path', {
        d: 'M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z'
      })
    ])
  }
}

const router = useRouter()
const route = useRoute()

const currentKey = computed(() => route.name as string)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    Home: '仪表盘',
    InvoiceList: '发票列表',
    InvoiceCreate: '创建发票',
    InvoiceDetail: '发票详情',
    CustomerList: '客户管理',
    TemplateList: '模板管理',
    Settings: '系统设置'
  }
  return titles[route.name as string] || 'InvoiceSimple'
})

const menuOptions: MenuOption[] = [
  {
    label: '仪表盘',
    key: 'Home',
    icon: () => h('span', { class: 'text-base' }, '📊')
  },
  {
    label: '发票管理',
    key: 'invoices',
    icon: () => h('span', { class: 'text-base' }, '📄'),
    children: [
      { label: '发票列表', key: 'InvoiceList' },
      { label: '创建发票', key: 'InvoiceCreate' }
    ]
  },
  {
    label: '客户管理',
    key: 'CustomerList',
    icon: () => h('span', { class: 'text-base' }, '👥')
  },
  {
    label: '模板管理',
    key: 'TemplateList',
    icon: () => h('span', { class: 'text-base' }, '🎨')
  },
  {
    label: '系统设置',
    key: 'Settings',
    icon: () => h('span', { class: 'text-base' }, '⚙️')
  }
]

function handleMenuClick(key: string) {
  router.push({ name: key })
}
</script>