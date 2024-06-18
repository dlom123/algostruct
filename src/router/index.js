import Vue from 'vue'
import VueRouter from 'vue-router'
import Algorithms from '@/views/Algorithms.vue'
import DataStructures from '@/views/DataStructures.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'algorithms' }
  },
  {
    path: '/algorithms',
    name: 'algorithms',
    component: Algorithms
  },
  {
    path: '/data-structures',
    name: 'dataStructures',
    component: DataStructures
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
