<template>
  <li
    :class="[
      'sidebar__item',
      props.route.currentPage ? props.activeClass + '_parent' : '',
    ]"
  >
    <router-link
      :to="getRoutePath(props.route.href)"
      :class="[
        'heading heading--4 heading--white w-100 p-y-8 p-x-10',
        props.route.currentPage ? props.activeClass : '',
      ]"
    >
      {{ props.route.linkName }}
      <span v-if="props.route.nested && !!props.route.nested.length"><IconDropdownArrow /></span>
    </router-link>
    <ul
      v-if="
        props.route.nested &&
          !!props.route.nested.length &&
          props.route.currentPage
      "
      class="sidebar__list"
    >
      <SidebarItemComponent
        v-for="item in props.route.nested"
        :key="item.href"
        :route="item"
        :active-class="props.activeClass"
      />
    </ul>
  </li>
</template>

<script lang="ts">
export default defineComponent({
  name: 'SidebarItemComponent',
})
</script>

<script lang="ts" setup>
import { inject, defineComponent } from 'vue'

// interface and types
import type IRouteItem from '@/interfaces/nav-route-item'
import type GetRoutePath from '@/types/routes/get-route-path'

// components
import IconDropdownArrow from '@/assets/icons/icon_dropdown_arrow.svg?component'

const getRoutePath = inject('getRoutePath') as GetRoutePath

interface IProps {
  route: IRouteItem
  activeClass: string
}

const props = defineProps<IProps>()
</script>
