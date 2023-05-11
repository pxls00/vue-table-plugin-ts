<template>
  <div class="wrapper">
    <SidebarMain />
    <div class="wrapper__content">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultLayout',
})
</script>

<script lang="ts" setup>
import SidebarMain from '@/components/sidebar/sidebar-main.vue'

import { RouterView } from 'vue-router'
</script>
