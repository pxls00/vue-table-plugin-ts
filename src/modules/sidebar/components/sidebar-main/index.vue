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

<script lang="ts" src="./index.ts"></script>
