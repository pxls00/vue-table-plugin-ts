import type { RouteRecordRaw } from 'vue-router'
import { getRoutePath } from '@/modules/router'

const routes: RouteRecordRaw[] = [
  {
    path: getRoutePath('carriers'),
    name: 'Carriers',
    redirect: getRoutePath('carriersDirectory'),
    meta: {
      layout: 'default',
    },
    children: [
      {
        path: getRoutePath('carriersDirectory'),
        name: 'Carriers Directory',
        component: () => import('@/pages/carriers/directory.vue'),
        meta: {},
      },
      {
        path: getRoutePath('carriersBase'),
        name: 'Carriers Base',
        component: () => import('@/pages/carriers/base.vue'),
        meta: {},
      },
    ],
  },
]

export default routes
