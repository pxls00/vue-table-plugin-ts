import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import carriersRoutes from '@/router/carriers'

import getRoutePath from '@/helpers/routes'

import HomePage from '@/pages/logistics.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: getRoutePath('logistics'),
  },
  {
    path: getRoutePath('logistics'),
    name: 'Logistics',
    meta: {
      layout: 'default',
    },
    component: HomePage,
  },
  ...carriersRoutes,
  {
    path: getRoutePath('logistics'),
    name: 'Logistics',
    meta: {
      layout: 'default',
    },
    component: () => import('@/pages/logistics.vue'),
  },
  {
    path: getRoutePath('signOut'),
    name: 'sign-out',
    redirect: getRoutePath('logistics'),
  },
  {
    path: getRoutePath('settings'),
    name: 'settings',
    redirect: getRoutePath('logistics'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
