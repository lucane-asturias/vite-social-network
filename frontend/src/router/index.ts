import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import FeedView from '@/modules/feed/views/FeedView.vue'
import PostView from '@/modules/feed/views/PostView.vue'
import AuthView from '@/modules/auth/views/AuthView.vue'
import ChatView from '@/modules/chat/views/ChatView.vue'
import SearchView from '@/modules/search/views/SearchView.vue'
import ProfileView from '@/modules/profile/views/ProfileView.vue'
import ProfileFriendsView from '@/modules/profile/views/ProfileFriendsView.vue'
import ProfileEditView from '@/modules/profile/views/ProfileEditView.vue'
import NotificationsView from '@/modules/notifications/views/NotificationsView.vue'
import TrendView from '@/modules/trend/views/TrendView.vue'
import AboutView from '@/views/AboutView.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/feed',
    name: 'feed',
    component: FeedView,
    children: [
      {
        path: ':id',
        name: 'post',
        component: PostView,
      },
    ],
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView,
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: ProfileView,
    children: [
      {
        path: 'friends',
        name: 'friends',
        component: ProfileFriendsView,
      },
    ],
  },
  {
    path: '/profile/edit',
    name: 'profile_edit',
    component: ProfileEditView,
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsView,
  },
  {
    path: '/trends/:id',
    name: 'trends',
    component: TrendView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
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
