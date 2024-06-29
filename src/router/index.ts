import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Library from '../views/Library.vue'
import Reader from '../views/Reader.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    // name: 'Library',
    component: Library,
  },
  {
    path: '/read',
    // name: 'Reader',
    component: Reader,
  },
  {
    path: '/read/:title',
    redirect: to => ({ path: `/read/${to.params.title}/0/0` }),
  },
  {
    path: '/read/:title/:chapter',
    redirect: to => ({ path: `/read/${to.params.title}/${to.params.chapter}/0` }),
  },
  {
    path: '/read/:title/:chapter/:slide',
    name: 'Reader',
    component: Reader,
  }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router