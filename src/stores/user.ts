import { ref } from 'vue'
import { defineStore } from 'pinia'

import type ICurrentUser from '@/interfaces/user'

const defaultUserCredentials = {
  name: 'Денис Потемкин',
  avatar: '',
}

export const useUserStore = defineStore('user', () => {
  const user = ref<ICurrentUser>(defaultUserCredentials)

  return { user }
})
