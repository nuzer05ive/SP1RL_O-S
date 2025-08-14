import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import NodeSplash from './pages/NodeSplash.vue'
import VRSeed from './pages/VRSeed.vue'

const routes = [
  { path: '/', component: NodeSplash },
  { path: '/vr', component: VRSeed }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp({})
app.use(router)
app.mount('#app')
