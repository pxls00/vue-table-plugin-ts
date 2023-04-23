import { ref } from 'vue'
import { defineStore } from 'pinia'

import type IRouteItem from '@/interfaces/nav-route-item'

export const useSidebarRoutesStore = defineStore('sidebarRoutes', () => {
  const routes = ref<IRouteItem[]>([
    {
      linkName: 'Логистика',
      href: 'logistics',
    },
    {
      linkName: 'Перевозчики',
      href: 'carriers',
      nested: [
        {
          linkName: 'Справочник',
          href: 'directory'
        },
        {
          linkName: 'База',
          href: 'base'
        },
      ],
    },
    {
      linkName: 'Задачи',
      href: 'tasks',
    },
    {
      linkName: 'Аналитика',
      href: 'analytics',
      nested: [
        {
          linkName: 'Справочник',
          href: 'directory'
        },
        {
          linkName: 'База',
          href: 'base'
        },
      ],
    },
  ])

  return { routes }
})
