import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useToastStore } from '@/store/toastStore'
import { useUserStore } from '@/modules/auth/store/userStore'
import type { User, Post } from '../interfaces/ResponseType'
import type { MessagesType } from '@/modules/chat/interfaces/ChatTypes'

type ResponseType = { user: User, posts: Post[] }

export const useProfileStore = defineStore('profileStore', () => {

  const route = useRoute()
  const router = useRouter()
  
  const userStore = useUserStore()
  const toastStore = useToastStore()

  // State Properties ============================

  const posts = ref<Post[]>([])
  const user = ref<User | { id: null }>({ id: null })
  const inSubmission = ref<boolean>(false)
  const inSubmissionLogout = ref<boolean>(false)
  const canSendFriendshipRequest = ref<boolean>(false)

  // Actions =====================================

  async function getUserFeedByRouteId() {
    try {
      const { data } = await axios.get(
        `/api/posts/profile/${route.params.id}/`
      ) as { data: ResponseType }

      posts.value = data.posts
      user.value = data.user
      canSendFriendshipRequest.value = data.can_send_friendship_request
    } catch (error) {
      console.error('ProfileView getUserFeedByRouteId error ---- ', error)
    }
  }

  function addNewPost(newPost: Post) {
    posts.value.unshift(newPost)
    user.value.posts_count++
  }

  async function sendFriendshipRequest() {
    inSubmission.value = true

    try {
      const { data } = await axios.post(
        `/api/friends/${route.params.id}/request/`
      )

      if (data.message === 'request already sent') {
        toastStore.showToast(5000, 'The request has already been sent!', 'bg-red-600')
      } else {
        toastStore.showToast(5000, 'The request was sent!', 'bg-emerald-600')
      }
      
      inSubmission.value = false
      canSendFriendshipRequest.value = false
    } catch (error) {
      console.error('error', error)
      inSubmission.value = false
    }
  }

  async function sendDirectMessage() {
    inSubmission.value = true
    try {
      const { data } = await axios.get(
        `/api/chat/${route.params.id}/get-or-create/`
      ) as MessagesType
      
      router.push({ name: 'chat' })
      inSubmission.value = false
    } catch (error) {
      console.log('sendDirectMessage error --> ', error)
      inSubmission.value = false
    }
  }

  function onLogOut() {
    console.log('Log out')
    inSubmissionLogout.value = true

    userStore.removeToken()

    router.push({ name: 'auth' })

    setTimeout(() => inSubmissionLogout.value = false, 5000)
  }

  return {
    user, posts, inSubmission, inSubmissionLogout,
    canSendFriendshipRequest,
    getUserFeedByRouteId, sendFriendshipRequest,
    sendDirectMessage, addNewPost, onLogOut
  }

})