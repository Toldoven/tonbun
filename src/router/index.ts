import { createRouter, createWebHistory } from 'vue-router'
import Library from '../views/Library.vue'
const routes = [
  {
    path: '/',
    name: 'Library',
    component: Library
  },
  {
    path: '/read/:uuid',
    name: 'Reader',
    component: () => import('../views/Reader.vue')
  }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router