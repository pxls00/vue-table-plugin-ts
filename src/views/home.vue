<template>
  <main>
    <div>1 page</div>
    <IconAddPlus />
    <IconDropDownArrow />
    <IconMenuBurger />
    <IconMenuDots />
    <IconSettings />
    <IconLogo />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
})
</script>

<script setup lang="ts">
import IconAddPlus from '@/assets/icons/icon_add_plus.svg?component'
import IconDropDownArrow from '@/assets/icons/icon_dropdown_arrow.svg?component'
import IconMenuBurger from '@/assets/icons/icon_menu_burger.svg?component'
import IconMenuDots from '@/assets/icons/icon_menu_dots.svg?component'
import IconSettings from '@/assets/icons/icon_settings.svg?component'
import IconLogo from '@/assets/icons/logo.svg?component'
</script>
