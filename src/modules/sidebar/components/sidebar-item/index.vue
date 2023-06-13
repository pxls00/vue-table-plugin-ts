<template>
  <li
    :class="['sidebar__item', route.currentPage ? activeClass + '_parent' : '']"
  >
    <router-link
      :to="getRoutePath(route.href)"
      :class="[
        'heading heading--4 heading--white w-100 p-y-8 p-x-10',
        route.currentPage ? activeClass : '',
      ]"
    >
      {{ route.linkName }}
      <span v-if="route.nested && !!route.nested.length"><IconDropdownArrow /></span>
    </router-link>
    <ul
      v-if="route.nested && !!route.nested.length && route.currentPage"
      class="sidebar__list"
    >
      <SidebarItemComponent
        v-for="item in route.nested"
        :key="item.href"
        :route="item"
        :active-class="activeClass"
      />
    </ul>
  </li>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang='scss' src='./index.scss' scoped></style>