import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '@/modules/auth/store/userStore'
import { useToastStore } from '@/store/toastStore'
import type { User, Post } from '../interfaces/ResponseType'
import type { MessagesType } from '@/modules/chat/interfaces/ChatTypes'

type ResponseType = { user: User, posts: Post[] }

export const useProfileView = () => {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const toastStore = useToastStore()

  const user = ref<User | { id: null }>({ id: null })
  const posts = ref<Post[]>([])
  const inSubmission = ref(false)
  const inSubmissionLogout = ref(false)
  
  const getUserFeedByRouteId = async () => {
    inSubmission.value = true
    try {
      const { data } = await axios.get(
        `/api/posts/profile/${route.params.id}/`
      ) as { data: ResponseType }
      
      posts.value = data.posts
      user.value = data.user

      inSubmission.value = false
    } catch (error) {
      inSubmission.value = false
      console.error('ProfileView getUserFeedByRouteId error ---- ', error)
    }
  }

  const onPostCreation = async (values: { body: string }, { resetForm }: { resetForm: Function }) => {
    try {
      const { data } = await axios.post('/api/posts/create/', { 
        'body': values.body 
      }) as { data: Post }

      posts.value.unshift(data)
      resetForm()
    } catch (error) {
      console.error('profileview --- error', error)
    }
  }

  const sendFriendshipRequest = async () => {
    try {
      const { data } = await axios.post(
        `/api/friends/${route.params.id}/request/`
      )

      if (data.message === 'request already sent') {
        toastStore.showToast(5000, 'The request has already been sent!', 'bg-red-600')
      } else {
        toastStore.showToast(5000, 'The request was sent!', 'bg-emerald-600')
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  const sendDirectMessage = async () => {
    try {
      const { data } = await axios.get(
        `/api/chat/${route.params.id}/get-or-create/`
      ) as MessagesType
      
      router.push({ name: 'chat' })
    } catch (error) {
      console.log('sendDirectMessage error --> ', error)
    }
  }

  const onLogOut = () => {
    console.log('Log out')
    inSubmissionLogout.value = true

    userStore.removeToken()

    router.push({ name: 'auth' })
    inSubmissionLogout.value = false
  }
  
  return {
    user, posts, inSubmission, inSubmissionLogout,
    getUserFeedByRouteId, onPostCreation, 
    sendFriendshipRequest, sendDirectMessage, onLogOut
  }
}