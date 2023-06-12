import { defineComponent, inject } from 'vue'
import IconDropdownArrow from '@/assets/icons/icon_dropdown_arrow.svg?component'

// types
import type { PropType } from 'vue'
import type { INavRouteItem } from '../../index.types'
import type GetRoutePath from '@/types/routes/get-route-path'

export default defineComponent({
  name: 'SidebarItemComponent',

  components: {
    IconDropdownArrow,
  },

  props: {
    route: {
      required: true,
      type: Object as PropType<INavRouteItem>,
    },
    activeClass: {
      required: true,
      type: String,
    },
  },

  setup() {
    const getRoutePath = inject('getRoutePath') as GetRoutePath

    return {
      getRoutePath,
    }
  },
})

// // interface and types
// import type IRouteItem from '@/interfaces/nav-route-item'
// import type GetRoutePath from '@/types/routes/get-route-path'

// // components
// import { getRoutePath } from '@/helpers/routes';

// const getRoutePath = inject('getRoutePath') as GetRoutePath

// interface IProps {
//   route: IRouteItem
//   activeClass: string
// }

// const props = defineProps<IProps>()
