import { getDB, generateId, now } from './db'
import type { Template, TemplateConfig } from '@/types'

// 默认模板配置
const defaultTemplates: Omit<Template, 'id' | 'createdAt'>[] = [
  {
    name: '经典简约',
    description: '简洁专业的设计，适合大多数场景',
    preview: '/templates/classic.png',
    isDefault: true,
    config: {
      primaryColor: '#4F46E5',
      secondaryColor: '#6366F1',
      fontFamily: 'Helvetica',
      fontSize: 10,
      showLogo: true,
      showTax: true,
      showNotes: true,
      logoPosition: 'left'
    }
  },
  {
    name: '现代商务',
    description: '现代感设计，适合科技公司',
    preview: '/templates/modern.png',
    isDefault: false,
    config: {
      primaryColor: '#0EA5E9',
      secondaryColor: '#38BDF8',
      fontFamily: 'Arial',
      fontSize: 10,
      showLogo: true,
      showTax: true,
      showNotes: true,
      logoPosition: 'right'
    }
  },
  {
    name: '专业正式',
    description: '正式严肃的风格，适合传统行业',
    preview: '/templates/professional.png',
    isDefault: false,
    config: {
      primaryColor: '#1E293B',
      secondaryColor: '#475569',
      fontFamily: 'Times New Roman',
      fontSize: 11,
      showLogo: true,
      showTax: true,
      showNotes: true,
      logoPosition: 'center'
    }
  },
  {
    name: '清新自然',
    description: '自然清新的配色，适合创意行业',
    preview: '/templates/fresh.png',
    isDefault: false,
    config: {
      primaryColor: '#10B981',
      secondaryColor: '#34D399',
      fontFamily: 'Georgia',
      fontSize: 10,
      showLogo: true,
      showTax: true,
      showNotes: true,
      logoPosition: 'left'
    }
  },
  {
    name: '极简白',
    description: '极简设计，只保留必要信息',
    preview: '/templates/minimal.png',
    isDefault: false,
    config: {
      primaryColor: '#6B7280',
      secondaryColor: '#9CA3AF',
      fontFamily: 'Helvetica',
      fontSize: 9,
      showLogo: false,
      showTax: false,
      showNotes: false,
      logoPosition: 'left'
    }
  }
]

// 初始化默认模板
export async function initDefaultTemplates(): Promise<void> {
  const db = getDB()
  const existing = await db.getAll('templates')

  if (existing.length === 0) {
    for (const template of defaultTemplates) {
      await db.add('templates', {
        ...template,
        id: generateId(),
        createdAt: now()
      })
    }
  }
}

// 获取所有模板
export async function getAllTemplates(): Promise<Template[]> {
  const db = getDB()
  return db.getAll('templates')
}

// 根据ID获取模板
export async function getTemplateById(id: string): Promise<Template | undefined> {
  const db = getDB()
  return db.get('templates', id)
}

// 获取默认模板
export async function getDefaultTemplate(): Promise<Template | undefined> {
  const templates = await getAllTemplates()
  return templates.find(t => t.isDefault) || templates[0]
}

// 创建自定义模板
export async function createTemplate(
  name: string,
  description: string,
  config: TemplateConfig
): Promise<Template> {
  const db = getDB()

  const template: Template = {
    id: generateId(),
    name,
    description,
    preview: '',
    config,
    isDefault: false,
    createdAt: now()
  }

  await db.add('templates', template)
  return template
}

// 更新模板
export async function updateTemplate(
  id: string,
  update: Partial<Omit<Template, 'id' | 'createdAt'>>
): Promise<Template> {
  const db = getDB()
  const existing = await getTemplateById(id)

  if (!existing) {
    throw new Error(`Template not found: ${id}`)
  }

  const updated: Template = {
    ...existing,
    ...update
  }

  await db.put('templates', updated)
  return updated
}

// 删除模板
export async function deleteTemplate(id: string): Promise<void> {
  const db = getDB()
  const template = await getTemplateById(id)

  if (template?.isDefault) {
    throw new Error('Cannot delete default template')
  }

  await db.delete('templates', id)
}

// 设置默认模板
export async function setDefaultTemplate(id: string): Promise<void> {
  const db = getDB()
  const templates = await getAllTemplates()

  for (const t of templates) {
    await db.put('templates', {
      ...t,
      isDefault: t.id === id
    })
  }
}