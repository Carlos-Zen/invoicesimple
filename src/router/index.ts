import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/invoices',
    name: 'InvoiceList',
    component: () => import('@/views/InvoiceList.vue')
  },
  {
    path: '/invoices/create',
    name: 'InvoiceCreate',
    component: () => import('@/views/InvoiceCreate.vue')
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetail',
    component: () => import('@/views/InvoiceDetail.vue')
  },
  {
    path: '/customers',
    name: 'CustomerList',
    component: () => import('@/views/CustomerList.vue')
  },
  {
    path: '/templates',
    name: 'TemplateList',
    component: () => import('@/views/TemplateList.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router