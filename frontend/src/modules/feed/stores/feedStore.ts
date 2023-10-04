import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import type { PostType } from '../interfaces/PostType'

export const useFeedStore = defineStore('feedStore', () => {

  // State Properties ============================

  const posts = ref<PostType[]>([])

  // Actions =====================================
  
  async function getPostsFeed() {
    try {
      const { data } = await axios.get('/api/posts/') as { data: PostType[] }

      posts.value = data
    } catch (error) {
      console.error('feedview error: ', error)
    }
  }

  function addNewPost(newPost: PostType) {
    posts.value.unshift(newPost)
    // user.value.posts_count++
  }

  function deletePost(id) {
    const postIndexToDelete = posts.value.findIndex(
      post => post.id === id
    )
    posts.value.splice(postIndexToDelete, 1)
  }
  
  return {
    posts, getPostsFeed, addNewPost, deletePost
  }

})