import { createRouter, createWebHistory } from 'vue-router'
import Library from '../views/Library.vue'
const routes = [
  {
    path: '/',
    name: 'Library',
    component: Library
  },
  // {
  //   path: '/read/:uuid',
  //   name: 'Reader',
  //   component: () => import('../views/Reader.vue'),
  // }
  {
    path: '/read/:title',
    redirect: to => ({ path: `/read/${to.params.title}/0/0` }),
    component: () => {},
  },
  {
    path: '/read/:title/:chapter',
    redirect: to => ({ path: `/read/${to.params.title}/${to.params.chapter}/0` }),
    component: () => {},
  },
  {
    path: '/read/:title/:chapter/:slide',
    name: 'Reader',
    component: () => import('../views/Reader.vue'),
  }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router