import axios from 'axios'
import { ref } from 'vue'

import type { PostsType } from '../interfaces/PostsType'

export const useFeedView = () => {
  const posts = ref<PostsType[]>([])

  const getPostsFeed = async () => {
    try {
      const { data } = await axios.get('/api/posts/') as { data: PostsType[] }

      posts.value = data
    } catch (error) {
      console.error('feedview error: ', error)
    }
  }

  const onPostSubmition = async (values: {
    body: string
  }, { resetForm }: { 
    resetForm: Function 
  }) => {
    try {
      const { data } = await axios.post('/api/posts/create/', {
        'body': values.body
      }) as { data: PostsType }
      posts.value.unshift(data)
      resetForm()
    } catch (error) {
      console.error('feedview -- error', error)
    }
  }
  
  return {
    posts, getPostsFeed, onPostSubmition
  }
}