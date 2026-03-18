<template>
  <div>
    <n-grid :cols="3" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="template in templates" :key="template.id">
        <n-card
          hoverable
          :class="{ 'ring-2 ring-indigo-500': template.isDefault }"
          @click="handleSelect(template)"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ template.name }}</span>
              <n-tag v-if="template.isDefault" type="success" size="small">默认</n-tag>
            </div>
          </template>

          <!-- 模板预览 -->
          <div
            class="h-40 rounded border flex items-center justify-center"
            :style="{ borderColor: template.config.primaryColor }"
          >
            <div class="text-center">
              <div
                class="text-lg font-bold mb-2"
                :style="{ color: template.config.primaryColor }"
              >
                发票预览
              </div>
              <div class="text-sm text-gray-400">{{ template.description }}</div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div
                  class="w-4 h-4 rounded"
                  :style="{ backgroundColor: template.config.primaryColor }"
                />
                <span class="text-xs text-gray-500">{{ template.config.fontFamily }}</span>
              </div>
              <n-button
                v-if="!template.isDefault"
                text
                type="primary"
                @click.stop="handleSetDefault(template)"
              >
                设为默认
              </n-button>
            </div>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NGrid, NGridItem, NCard, NTag, NButton, useMessage } from 'naive-ui'
import { useTemplateStore } from '@/stores'
import type { Template } from '@/types'

const message = useMessage()
const templateStore = useTemplateStore()

const templates = computed(() => templateStore.templates)

async function handleSelect(template: Template) {
  // 可以在这里添加预览功能
}

async function handleSetDefault(template: Template) {
  await templateStore.setDefault(template.id)
  message.success(`已将 "${template.name}" 设为默认模板`)
}

onMounted(() => {
  templateStore.fetchTemplates()
})
</script>