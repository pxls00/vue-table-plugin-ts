<template>
  <component :is="layoutName">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import {
  // useRoute,
  RouterView,
} from 'vue-router'

import { computed } from 'vue'

import DefaultLayout from '@/layouts/default.vue'
// import AuthLayout from '@/layouts/auth.vue'

// const route = useRoute()

const layoutName = computed(() => 
  // return route.meta.layout === 'default' ? DefaultLayout : AuthLayout
   DefaultLayout
)
</script>
