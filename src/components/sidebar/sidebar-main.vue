<template>
  <div class="sidebar">
    <div class="sidebar__logo p-x-54 p-y-30">
      <IconLogo />
    </div>
    <div class="sidebar__nav">
      <ul class="sidebar__list">
        <SidebarItem
          v-for="item in routes"
          :key="item.href"
          :route="item"
          :active-class="'sidebar__item--active'"
        />
      </ul>
    </div>
    <div class="sidebar__footer m-t-auto p-x-16">
      <AppProfile :more-routes="moreRoutes" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SidebarMainComponent',
})
</script>

<script lang="ts" setup>
import { ref, inject, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

// components
import IconLogo from '@/assets/icons/logo.svg?component'
import AppProfile from '@/components/app/profile.vue'
import SidebarItem from '@/components/sidebar/sidebar-item.vue'

// contstants
import { SIDEBAR_ROUTES } from '@/constants/sidebar-routes'

// interface and types
import type IRouteItem from '@/interfaces/nav-route-item'
import type GetRoutePath from '@/types/routes/get-route-path'

const routes = ref<IRouteItem[]>(SIDEBAR_ROUTES)
const moreRoutes = ref<IRouteItem[]>([
  {
    href: 'settings',
    linkName: 'Личные настройки',
  },
  {
    href: 'signOut',
    linkName: 'Выход',
  },
])
const route = useRoute()

const getRoutePath = inject('getRoutePath') as GetRoutePath

setCurrentPage(route.path)

function setCurrentPage (path: string) {
  routes.value.forEach((link: IRouteItem, index): void => {
    link.currentPage = path.startsWith(getRoutePath(link.href))

    if (link.nested && link.nested.length) {
      routes.value[index].nested = ref<IRouteItem[]>(link.nested)
      // console.log(isRef(routes.value[index].nested))
      setCurrentPageRoute(link.nested, path)
    }
  })
}

function setCurrentPageRoute (
  routesList: IRouteItem[] | any,
  path: string
): void {
  routesList.forEach((link: IRouteItem): void => {
    link.currentPage = path.startsWith(getRoutePath(link.href))
  })
}

watchEffect(() => {
  setCurrentPage(route.path)
})
</script>
