import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// lazy-load: dynamically load components when its needed
const HomeView = () => import('@/views/HomeView.vue')
const FeedView = () => import('@/views/FeedView.vue')
const AuthView = () => import('@/modules/auth/views/AuthView.vue')
const MessagesView = () => import('@/views/MessagesView.vue')
const SearchView = () => import('@/views/SearchView.vue')

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/feed',
    name: 'feed',
    component: FeedView
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  },
  {
    path: '/messages',
    name: 'messages',
    component: MessagesView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // scroll to top when navigating to a new route
    return { top: 0 }
  }
})
export default router
