import { defineComponent, ref, inject, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { SIDEBAR_ROUTES } from '../../constants/sidebar-routes'
import SidebarItem from '../sidebar-item/index.vue'
import IconLogo from '@/assets/icons/logo.svg?component'

// types
import type { INavRouteItem } from '../../index.types'
import type { Ref } from 'vue'
import type GetRoutePath from '@/types/routes/get-route-path'

export default defineComponent({
  name: 'SidebarMainComponent',
  components: {
    SidebarItem,
    IconLogo,
  },
  setup() {
    const route = useRoute()
    const getRoutePath = inject('getRoutePath') as GetRoutePath
    const routes = ref<INavRouteItem[]>(SIDEBAR_ROUTES)
    const moreRoutes = ref<INavRouteItem[]>([
      {
        href: 'settings',
        linkName: 'Личные настройки',
      },
      {
        href: 'signOut',
        linkName: 'Выход',
      },
    ])

    setCurrentPage(route.path)

    function setCurrentPage(path: string) {
      routes.value.forEach((link: INavRouteItem, index): void => {
        link.currentPage = path.startsWith(getRoutePath(link.href))

        if (Array.isArray(link.nested)) {
          if (Array.isArray(routes.value[index].nested)) {
            routes.value[index].nested = ref<INavRouteItem[]>(
              link.nested
            ) as Ref<INavRouteItem[]>
          }
          setCurrentPageRoute(link.nested, path)
        }
      })
    }

    function setCurrentPageRoute(
      routesList: INavRouteItem[],
      path: string
    ): void {
      routesList.forEach((link: INavRouteItem): void => {
        link.currentPage = path.startsWith(getRoutePath(link.href))
      })
    }

    watchEffect(() => {
      setCurrentPage(route.path)
    })

    return {
      routes,
      moreRoutes,
    }
  },
})

// // components
// import AppProfile from '@/components/app/profile.vue'
// import SidebarItem from '@/components/sidebar/sidebar-item.vue'

// // contstants
// import { SIDEBAR_ROUTES } from '@/constants/sidebar-routes'

// // interface and types
// import type IRouteItem from '@/interfaces/nav-route-item'
// import type GetRoutePath from '@/types/routes/get-route-path'
// import component from './../../../../shims-vue.d';

// const routes = ref<IRouteItem[]>(SIDEBAR_ROUTES)
// const moreRoutes = ref<IRouteItem[]>([
//   {
//     href: 'settings',
//     linkName: 'Личные настройки',
//   },
//   {
//     href: 'signOut',
//     linkName: 'Выход',
//   },
// ])
// const route = useRoute()

// const getRoutePath = inject('getRoutePath') as GetRoutePath
