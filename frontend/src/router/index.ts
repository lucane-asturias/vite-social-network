import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// lazy-load: dynamically load components when its needed
const HomeView = () => import('@/views/HomeView.vue')
const AuthView = () => import('@/modules/auth/views/AuthView.vue')

const FeedView = () => import('@/modules/feed/views/FeedView.vue')
const PostView = () => import('@/modules/feed/views/PostView.vue')

const ProfileView = () => import('@/modules/profile/views/ProfileView.vue')
const ProfileEditView = () => import('@/modules/profile/views/ProfileEditView.vue')
const FriendsView = () => import('@/modules/profile/views/FriendsView.vue')

const TrendView = () => import('@/modules/trend/views/TrendView.vue')

const SearchView = () => import('@/modules/search/views/SearchView.vue')
const ChatView = () => import('@/modues/chat/views/ChatView.vue')

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
    path: '/chat',
    name: 'chat',
    component: ChatView
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
    path: '/profile/edit',
    name: 'profile_edit',
    component: ProfileEditView
  },
  {
    path: '/profile/:id/friends',
    name: 'friends',
    component: FriendsView
  },
  {
    path: '/:id',
    name: 'post',
    component: PostView
  },
  {
    path: '/trends/:id',
    name: 'trends',
    component: TrendView
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
