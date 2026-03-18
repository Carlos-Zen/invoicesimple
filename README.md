# InvoiceSimple

<p align="center">
  <strong>极简发票生成器 | Minimalist Invoice Generator</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4-brightgreen" alt="Vue 3.4">
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue" alt="TypeScript 5.4">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</p>

<p align="center">
  <a href="#english">English</a> | <a href="#中文">中文</a>
</p>

---

<a name="english"></a>
## English

A modern invoice management tool designed for freelancers, small business owners, and individual entrepreneurs.

### ✨ Features

- 🚀 **Minimalist Design** - Create professional invoices in 30 seconds
- 💾 **Local Storage** - Data stored locally, no privacy concerns
- 📄 **PDF Export** - One-click professional PDF generation
- 🎨 **Multiple Templates** - 5 preset templates for different needs
- 👥 **Customer Management** - Easy customer information management
- 📱 **Responsive Design** - Desktop and mobile support

### 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Vue 3 + TypeScript | Frontend Framework |
| Vite | Build Tool |
| Pinia | State Management |
| Naive UI | UI Components |
| IndexedDB | Local Storage |
| jsPDF | PDF Generation |

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Carlos-Zen/invoicesimple.git
cd invoicesimple

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 📁 Project Structure

```
src/
├── views/          # Page components
├── components/     # Reusable components
├── stores/         # Pinia state management
├── services/       # Business services
├── utils/          # Utility functions
├── types/          # TypeScript definitions
├── router/         # Vue Router config
└── assets/         # Static assets
```

### 📋 Features Detail

#### Invoice Management
- Create, edit, delete invoices
- Multiple status: Draft, Sent, Paid, Overdue, Cancelled
- Auto-generate invoice numbers
- Itemized billing

#### Customer Management
- CRUD operations
- Quick search
- Invoice association

#### Template System
- 5 preset templates
- Custom colors and fonts
- Set default template

#### PDF Generation
- Professional PDF format
- Download and print support
- Company branding

### 💾 Data Storage

All data is stored in the browser's IndexedDB:
- User information
- Customer data
- Invoice records
- Template configurations

Supports data export and import for backup.

### 📄 License

[MIT](LICENSE)

---

<a name="中文"></a>
## 中文

一个现代化的发票管理工具，专为自由职业者、小微企业主和个体工商户设计。

### ✨ 特性

- 🚀 **极简设计** - 30秒完成专业发票
- 💾 **本地存储** - 数据存储在本地，无需担心隐私
- 📄 **PDF导出** - 一键生成专业PDF发票
- 🎨 **多种模板** - 5种预设模板，满足不同需求
- 👥 **客户管理** - 轻松管理客户信息
- 📱 **响应式设计** - 支持桌面和移动设备

### 🛠 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + TypeScript | 前端框架 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| Naive UI | UI组件库 |
| IndexedDB | 本地存储 |
| jsPDF | PDF生成 |

### 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/Carlos-Zen/invoicesimple.git
cd invoicesimple

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 📁 项目结构

```
src/
├── views/          # 页面组件
├── components/     # 通用组件
├── stores/         # Pinia状态管理
├── services/       # 业务服务
├── utils/          # 工具函数
├── types/          # 类型定义
├── router/         # 路由配置
└── assets/         # 静态资源
```

### 📋 功能详情

#### 发票管理
- 创建、编辑、删除发票
- 多种状态：草稿、已发送、已收款、已逾期、已取消
- 自动生成发票编号
- 商品明细管理

#### 客户管理
- 客户信息增删改查
- 快速搜索
- 关联发票查看

#### 模板系统
- 5种预设模板
- 自定义颜色和字体
- 设置默认模板

#### PDF生成
- 专业PDF格式
- 支持下载和打印
- 包含公司信息

### 💾 数据存储

所有数据存储在浏览器的IndexedDB中：
- 用户信息
- 客户数据
- 发票记录
- 模板配置

支持数据导出和导入备份。

### 📄 许可证

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Carlos-Zen">Carlos-Zen</a>
</p>