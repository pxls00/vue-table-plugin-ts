// Create app
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// Pinia
import { createPinia } from 'pinia'
app.use(createPinia())

// Router
import router from '@/router'
app.use(router)

// Styles
import '@/assets/styles/main.scss'


// Route get path helper plugin
import {getRoutePathPlugin} from '@/modules/router/index'
app.use(getRoutePathPlugin)

// provide
app.mount('#app')
