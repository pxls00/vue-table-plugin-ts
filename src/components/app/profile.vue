<template>
  <div class="profile">
    <div
      class="profile__content d-flex align-items-center p-y-10 w-100"
      @click="() => (isShowed = !isShowed)"
    >
      <div
        class="profile__content--avatar d-flex align-items-center justify-content-center m-r-8 white white2"
      >
        <img v-if="user.avatar" :src="user.avatar" alt="profile avatar">
        <span v-else class="heading heading--3">{{ user.name[0] }}</span>
      </div>
      <div class="profile__content--name">
        <h4 class="heading heading--4 heading--white">
          {{ user.name }}
        </h4>
      </div>
    </div>
    <div v-if="isShowed" class="profile__actions white w-100">
      <ul class="profile__list">
        <li
          v-for="item in props.moreRoutes"
          :key="item.href"
          :class="['nav-item p-y-8 p-x-10']"
        >
          <router-link
            :to="getRoutePath(item.href)"
            class="heading heading--4 w-100"
            @click="() => (isShowed = !isShowed)"
          >
            {{ item.linkName }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppPofile',
})
</script>

<script lang="ts" setup>
import { inject, ref } from 'vue'

// store
import { useUserStore } from '@/stores/user'

// interface and types
import type IRouteItem from '@/interfaces/nav-route-item'
import type GetRoutePath from '@/types/routes/get-route-path'

const { user } = useUserStore()

const getRoutePath = inject('getRoutePath') as GetRoutePath

interface IPorps {
  moreRoutes: IRouteItem[]
}

const props = defineProps<IPorps>()

const isShowed = ref<boolean>(false)
</script>
