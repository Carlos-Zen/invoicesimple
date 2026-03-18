# InvoiceSimple 技术设计文档

## 1. 系统架构

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Vue 3)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Views    │  │ Components│  │ Stores   │  │ Utils    │       │
│  │ 页面层   │  │ 组件层    │  │ 状态管理 │  │ 工具函数 │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │             │               │
│       └─────────────┴──────┬──────┴─────────────┘               │
│                            │                                     │
│                     ┌──────┴──────┐                             │
│                     │   Router    │                             │
│                     │   路由层    │                             │
│                     └──────┬──────┘                             │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                     ┌──────┴──────┐                             │
│                     │  API Layer  │                             │
│                     │  接口层     │                             │
│                     └──────┬──────┘                             │
│                            │                                     │
│  ┌─────────────────────────┼─────────────────────────────────┐ │
│  │                   Service Layer                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │
│  │  │ Invoice  │  │ Customer │  │ Template │                │ │
│  │  │ Service  │  │ Service  │  │ Service  │                │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘                │ │
│  └───────┼─────────────┼─────────────┼───────────────────────┘ │
│          │             │             │                          │
│  ┌───────┴─────────────┴─────────────┴───────────────────────┐ │
│  │                   Data Layer (IndexedDB)                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │ invoices │  │customers │  │templates │  │  users   │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈选型

| 层级 | 技术选型 | 选型理由 |
|------|----------|----------|
| **前端框架** | Vue 3 | 组合式API、性能优秀、学习曲线平缓 |
| **开发语言** | TypeScript | 类型安全、IDE支持好、重构友好 |
| **构建工具** | Vite | 快速冷启动、HMR、ESM原生支持 |
| **状态管理** | Pinia | Vue官方推荐、DevTools支持、TypeScript友好 |
| **路由** | Vue Router 4 | Vue官方路由、功能完善 |
| **UI组件** | Naive UI | TypeScript原生、组件丰富、Tree-shaking |
| **CSS方案** | UnoCSS | 原子化CSS、性能优秀、按需生成 |
| **本地存储** | IndexedDB | 大容量存储、异步API、支持复杂查询 |
| **PDF生成** | jsPDF | 纯前端生成PDF、无需后端 |
| **打包** | Electron (可选) | 跨平台桌面应用 |

---

## 2. 模块设计

### 2.1 目录结构

```
src/
├── main.ts                    # 应用入口
├── App.vue                    # 根组件
├── vite-env.d.ts             # 类型声明
│
├── views/                     # 页面组件
│   ├── Home.vue              # 首页
│   ├── InvoiceList.vue       # 发票列表
│   ├── InvoiceCreate.vue     # 创建发票
│   ├── InvoiceDetail.vue     # 发票详情
│   ├── CustomerList.vue      # 客户列表
│   ├── TemplateList.vue      # 模板列表
│   └── Settings.vue          # 设置
│
├── components/                # 通用组件
│   ├── common/               # 基础组件
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   ├── invoice/              # 发票相关组件
│   │   ├── InvoiceForm.vue
│   │   ├── InvoicePreview.vue
│   │   └── InvoiceItem.vue
│   └── customer/             # 客户相关组件
│       └── CustomerForm.vue
│
├── stores/                    # Pinia状态管理
│   ├── index.ts
│   ├── invoice.ts            # 发票状态
│   ├── customer.ts           # 客户状态
│   ├── template.ts           # 模板状态
│   └── user.ts               # 用户状态
│
├── services/                  # 业务服务
│   ├── db.ts                 # IndexedDB封装
│   ├── invoice.service.ts    # 发票服务
│   ├── customer.service.ts   # 客户服务
│   ├── template.service.ts   # 模板服务
│   ├── pdf.service.ts        # PDF生成服务
│   └── export.service.ts     # 导出服务
│
├── composables/               # 组合式函数
│   ├── useInvoice.ts
│   ├── useCustomer.ts
│   └── useNotification.ts
│
├── utils/                     # 工具函数
│   ├── format.ts             # 格式化
│   ├── validate.ts           # 验证
│   ├── calculate.ts          # 计算
│   └── storage.ts            # 存储工具
│
├── types/                     # 类型定义
│   ├── invoice.ts
│   ├── customer.ts
│   ├── template.ts
│   └── user.ts
│
├── constants/                 # 常量
│   ├── invoice.ts
│   └── templates.ts
│
├── router/                    # 路由配置
│   └── index.ts
│
└── assets/                    # 静态资源
    ├── images/
    └── styles/
```

### 2.2 核心模块接口

```typescript
// types/invoice.ts
export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

// types/customer.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
}

// types/template.ts
export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  config: TemplateConfig;
  isDefault: boolean;
  createdAt: string;
}

export interface TemplateConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  showLogo: boolean;
  showTax: boolean;
  showNotes: boolean;
}
```

---

## 3. 数据模型

### 3.1 ER图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   User      │       │  Invoice    │       │  Customer   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │──┐    │ id          │    ┌──│ id          │
│ email       │  │    │ invoiceNum  │    │  │ name        │
│ name        │  │    │ status      │    │  │ email       │
│ company     │  │    │ customerId  │◄───┘  │ phone       │
│ createdAt   │  │    │ templateId  │       │ address     │
└─────────────┘  │    │ subtotal    │       │ company     │
                 │    │ tax         │       │ taxId       │
                 │    │ total       │       └─────────────┘
                 │    │ issueDate   │
                 │    │ dueDate     │       ┌─────────────┐
                 │    │ notes       │       │  Template   │
                 │    │ createdAt   │       ├─────────────┤
                 └───►│ createdBy   │    ┌──│ id          │
                      └─────────────┘    │  │ name        │
                                         │  │ description │
                      ┌─────────────┐    │  │ config      │
                      │ InvoiceItem │    │  │ isDefault   │
                      ├─────────────┤    │  └─────────────┘
                      │ id          │    │
                      │ invoiceId   │◄───┘
                      │ description │
                      │ quantity    │
                      │ unitPrice   │
                      │ amount      │
                      └─────────────┘
```

### 3.2 数据库表结构

```typescript
// services/db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface InvoiceDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      name: string;
      company?: string;
      logo?: string;
      address?: string;
      phone?: string;
      taxId?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  customers: {
    key: string;
    value: Customer;
    indexes: {
      'by-name': string;
      'by-email': string;
    };
  };
  invoices: {
    key: string;
    value: Invoice;
    indexes: {
      'by-number': string;
      'by-customer': string;
      'by-status': string;
      'by-date': string;
    };
  };
  templates: {
    key: string;
    value: Template;
  };
}

const DB_NAME = 'invoice-simple';
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase<InvoiceDB>> {
  return openDB<InvoiceDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }

      // Customers store
      if (!db.objectStoreNames.contains('customers')) {
        const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
        customerStore.createIndex('by-name', 'name');
        customerStore.createIndex('by-email', 'email');
      }

      // Invoices store
      if (!db.objectStoreNames.contains('invoices')) {
        const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id' });
        invoiceStore.createIndex('by-number', 'invoiceNumber');
        invoiceStore.createIndex('by-customer', 'customerId');
        invoiceStore.createIndex('by-status', 'status');
        invoiceStore.createIndex('by-date', 'issueDate');
      }

      // Templates store
      if (!db.objectStoreNames.contains('templates')) {
        db.createObjectStore('templates', { keyPath: 'id' });
      }
    },
  });
}
```

---

## 4. API设计

### 4.1 服务层接口

```typescript
// services/invoice.service.ts
export class InvoiceService {
  private db: IDBPDatabase<InvoiceDB>;

  constructor(db: IDBPDatabase<InvoiceDB>) {
    this.db = db;
  }

  // 创建发票
  async create(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await this.db.add('invoices', newInvoice);
    return newInvoice;
  }

  // 获取所有发票
  async getAll(): Promise<Invoice[]> {
    return this.db.getAll('invoices');
  }

  // 根据ID获取
  async getById(id: string): Promise<Invoice | undefined> {
    return this.db.get('invoices', id);
  }

  // 更新发票
  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const existing = await this.getById(id);
    if (!existing) throw new Error('Invoice not found');

    const updated: Invoice = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await this.db.put('invoices', updated);
    return updated;
  }

  // 删除发票
  async delete(id: string): Promise<void> {
    await this.db.delete('invoices', id);
  }

  // 按状态筛选
  async getByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    return this.db.getAllFromIndex('invoices', 'by-status', status);
  }

  // 生成发票号
  async generateInvoiceNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const count = await this.getCountByMonth(year, now.getMonth() + 1);
    return `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }

  private async getCountByMonth(year: number, month: number): Promise<number> {
    const all = await this.getAll();
    return all.filter(inv => {
      const date = new Date(inv.issueDate);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    }).length;
  }
}
```

### 4.2 PDF生成服务

```typescript
// services/pdf.service.ts
import jsPDF from 'jspdf';

export class PDFService {
  async generateInvoice(invoice: Invoice, customer: Customer, user: User, template: Template): Promise<Blob> {
    const doc = new jsPDF();
    const config = template.config;

    // 页眉 - 公司信息
    doc.setFontSize(20);
    doc.setTextColor(config.primaryColor);
    doc.text(user.company || '发票', 20, 20);

    if (config.showLogo && user.logo) {
      // 添加Logo
    }

    // 发票信息
    doc.setFontSize(12);
    doc.setTextColor('#666666');
    doc.text(`发票编号: ${invoice.invoiceNumber}`, 20, 35);
    doc.text(`开票日期: ${invoice.issueDate}`, 20, 42);
    doc.text(`到期日期: ${invoice.dueDate}`, 20, 49);

    // 客户信息
    doc.setFontSize(11);
    doc.text('客户信息:', 20, 65);
    doc.text(customer.name, 20, 72);
    if (customer.company) doc.text(customer.company, 20, 79);
    if (customer.address) doc.text(customer.address, 20, 86);

    // 商品明细表格
    let y = 100;
    doc.setFillColor(config.primaryColor);
    doc.rect(20, y - 5, 170, 8, 'F');
    doc.setTextColor('#ffffff');
    doc.text('商品名称', 22, y);
    doc.text('数量', 90, y);
    doc.text('单价', 115, y);
    doc.text('金额', 150, y);

    doc.setTextColor('#333333');
    invoice.items.forEach((item, index) => {
      y += 10;
      doc.text(item.description.substring(0, 30), 22, y);
      doc.text(String(item.quantity), 90, y);
      doc.text(this.formatCurrency(item.unitPrice), 115, y);
      doc.text(this.formatCurrency(item.amount), 150, y);
    });

    // 合计
    y += 20;
    doc.setFontSize(11);
    doc.text(`小计: ${this.formatCurrency(invoice.subtotal)}`, 130, y);
    if (config.showTax) {
      y += 7;
      doc.text(`税费: ${this.formatCurrency(invoice.tax)}`, 130, y);
    }
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(config.primaryColor);
    doc.text(`总计: ${this.formatCurrency(invoice.total)}`, 130, y);

    // 备注
    if (config.showNotes && invoice.notes) {
      y += 20;
      doc.setFontSize(10);
      doc.setTextColor('#666666');
      doc.text('备注:', 20, y);
      doc.text(invoice.notes, 20, y + 7);
    }

    // 页脚
    doc.setFontSize(9);
    doc.setTextColor('#999999');
    doc.text('本发票由 InvoiceSimple 生成', 20, 285);

    return doc.output('blob');
  }

  private formatCurrency(amount: number): string {
    return `¥${amount.toFixed(2)}`;
  }
}
```

---

## 5. 安全设计

### 5.1 数据安全

| 安全措施 | 实现方式 |
|----------|----------|
| 本地加密 | 敏感数据使用 Web Crypto API 加密存储 |
| 数据备份 | 支持导出加密备份文件 |
| 数据清除 | 提供安全删除功能，覆盖存储空间 |

### 5.2 用户认证（可选扩展）

```typescript
// 本地密码保护
export class AuthService {
  private key: CryptoKey | null = null;

  async setPassword(password: string): Promise<void> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    this.key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('invoice-simple-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: string): Promise<string> {
    if (!this.key) throw new Error('No key set');
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encoder.encode(data)
    );
    return btoa(String.fromCharCode(...iv, ...new Uint8Array(encrypted)));
  }

  async decrypt(encryptedData: string): Promise<string> {
    if (!this.key) throw new Error('No key set');
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  }
}
```

---

## 6. 部署方案

### 6.1 Web部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 6.2 Electron打包（可选）

```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "electron:build": "npm run build && electron-builder",
    "electron:dev": "concurrently \"vite\" \"electron .\""
  },
  "build": {
    "appId": "com.invoicesimple.app",
    "productName": "InvoiceSimple",
    "directories": {
      "output": "release"
    },
    "mac": {
      "category": "public.app-category.finance"
    },
    "win": {
      "target": "nsis"
    }
  }
}
```

---

## 7. 性能指标

| 指标 | 目标值 |
|------|--------|
| 首页加载时间 | < 2秒 |
| 发票列表渲染 | < 500ms |
| PDF生成时间 | < 3秒 |
| 数据库查询 | < 100ms |
| 打包后体积 | < 5MB |