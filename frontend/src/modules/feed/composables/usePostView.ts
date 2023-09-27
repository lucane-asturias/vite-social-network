import axios from 'axios'
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import type { PostType } from '../interfaces/PostType'

export const usePostView = () => {
  const route = useRoute()
  const post = ref<PostType[]>({ id: null, comments: [] })
  const commentInSubmission = ref(false)

  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        `/api/posts/${route.params.id}/`
      ) as { data: PostType[] }

      post.value = data.post
    } catch(error) {
      console.log('error', error)
    }
  }

  const onCommentSubmition = async (values: {
    body: string
  }, { resetForm }: { 
    resetForm: Function 
  }) => {
    commentInSubmission.value = true

    try {
      const { data } = await axios.post(
        `/api/posts/${route.params.id}/comment/`, {
        body: values.body
      }) as PostType

      commentInSubmission.value = false
      post.value.comments.push(data)
      post.value.comments_count++
      resetForm()
    } catch (error) {
      console.error('[PostView.vue] -- on comment submition error ', error)
      commentInSubmission.value = false
    }
  }
  
  return {
    post, commentInSubmission, 
    getPosts, onCommentSubmition
  }
}