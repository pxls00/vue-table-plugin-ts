<template>
  <li
    :class="['nav-item p-y-8 p-x-10']"
    v-bind="$attrs"
  >
    <router-link
      :to="props.to"
      class="heading heading--4"
    >
      <slot></slot>
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppUiNavItem',
})
</script>

<script lang="ts" setup>
import type { RouteLocation } from 'vue-router'

interface IProps {
  classList?: string[]
  to: RouteLocation
}

const props = defineProps<IProps>()
</script>
