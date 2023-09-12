import axios from 'axios'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '@/modules/auth/store/userStore'
import type { User, Post } from '../interfaces/ResponseType'

type ResponseType = { user: User, posts: Post[] }

export const useProfileView = () => {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  const user = ref<User | { id: null }>({ id: null })
  const posts = ref<Post[]>([])
  
  const getUserFeedByRouteId = async () => {
    try {
      const { data } = await axios.get(
        `/api/posts/profile/${route.params.id}/`
      ) as { data: ResponseType }
      
      posts.value = data.posts
      user.value = data.user

    } catch (error) {
      console.log('ProfileView getUserFeedByRouteId error ---- ', error)
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
      console.log('profileview --- error', error)
    }
  }

  const onLogOut = () => {
    console.log('Log out')

    userStore.removeToken()

    router.push({ name: 'auth' })
  }
  
  return {
    user, posts, 
    getUserFeedByRouteId, onPostCreation, onLogOut
  }
}