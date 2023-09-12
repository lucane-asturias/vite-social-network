import axios from 'axios'
import { ref } from 'vue'
import type { ResponseType, User, Post } from '../interfaces/ResponseType'

export const useSearchView = () => {
  const users = ref<User[]>([])
  const posts = ref<Post[]>([])

  const search_in_submission = ref<boolean>(false)

  const onSearchQuery = async (values: { query: string }) => {
    search_in_submission.value = true

    try {
      const { data } = await axios.post('/api/search/', { 
        query: values.query 
      }) as { data: ResponseType }
      users.value = data.users
      posts.value = data.posts
      search_in_submission.value = false
    } catch (error) {
      search_in_submission.value = false
      console.log('SearchView onSearchQuery error --- ', error)
    }
  }
  
  return {
    users, posts, search_in_submission, onSearchQuery
  }
}