// 模板配置
export interface TemplateConfig {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: number
  showLogo: boolean
  showTax: boolean
  showNotes: boolean
  logoPosition: 'left' | 'center' | 'right'
}

// 发票模板
export interface Template {
  id: string
  name: string
  description: string
  preview: string
  config: TemplateConfig
  isDefault: boolean
  createdAt: string
}

// 模板输入
export type TemplateInput = Omit<Template, 'id' | 'createdAt'>