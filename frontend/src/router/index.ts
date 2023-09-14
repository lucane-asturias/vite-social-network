import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// lazy-load: dynamically load components when its needed
const HomeView = () => import('@/views/HomeView.vue')
const AuthView = () => import('@/modules/auth/views/AuthView.vue')
const FeedView = () => import('@/modules/feed/views/FeedView.vue')
const SearchView = () => import('@/modules/feed/views/SearchView.vue')
const ProfileView = () => import('@/modules/feed/views/ProfileView.vue')
const FriendsView = () => import('@/modules/feed/views/FriendsView.vue')
const MessagesView = () => import('@/views/MessagesView.vue')

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
    path: '/profile/:id',
    name: 'profile',
    component: ProfileView
  },
  {
    path: '/profile/:id/friends',
    name: 'friends',
    component: FriendsView
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
