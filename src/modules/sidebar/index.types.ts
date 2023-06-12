import type { Ref } from 'vue'

// enums

// types

// interface
export interface INavRouteItem {
  linkName: string
  href: string
  nested?: Ref<INavRouteItem[]> | any
  currentPage?: boolean
}
