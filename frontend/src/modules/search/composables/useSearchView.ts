import axios from 'axios'
import { ref } from 'vue'
import type { ResponseType, User, Post } from '@/modules/profile/interfaces/ResponseType'

export const useSearchView = () => {
  const users = ref<User[]>([])
  const posts = ref<Post[]>([])

  const searchInSubmission = ref<boolean>(false)

  const onSearchQuery = async (values: { query: string }) => {
    searchInSubmission.value = true

    try {
      const { data } = await axios.post('/api/search/', { 
        query: values.query 
      }) as { data: ResponseType }

      users.value = data.users
      posts.value = data.posts
      searchInSubmission.value = false
    } catch (error) {
      searchInSubmission.value = false
      console.log('SearchView onSearchQuery error --- ', error)
    }
  }
  
  return {
    users, posts, searchInSubmission, onSearchQuery
  }
}