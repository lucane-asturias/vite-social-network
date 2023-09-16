<script lang="ts" setup>
  import axios from 'axios'
  import { reactive, ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import PeopleYouMayKnow from '../components/PeopleYouMayKnow.vue'
  import Trends from '../components/Trends.vue'
  import FeedItem from '../components/FeedItem.vue'
  import CommentItem from '../components/CommentItem.vue'

  import type { PostsType } from '../interfaces/PostsType'

  const route = useRoute()

  const post = ref({ id: null, comments: [] })
  const comments = ref([])
  const comment_in_submission = ref(false)

  const commentSchema = reactive({ body: 'max:255' })

  onMounted(async () => await getPosts())

  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        `/api/posts/${route.params.id}/`
      ) as { data: PostsType[] }

      post.value = data.post
    } catch(error) {
      console.log('error', error)
    }
  }

  const onCommentSubmition = async (values: { body: string }, { resetForm }) => {
    comment_in_submission.value = true
    try {
      const { data } = await axios.post(
        `/api/posts/${route.params.id}/comment/`, {
        body: values.body
      }) as PostsType

      comment_in_submission.value = false
      post.value.comments.push(data)
      post.value.comments_count++
      resetForm()
    } catch (error) {
      console.error('[PostView.vue] -- on comment submition error ', error)
      comment_in_submission.value = false
    }
  }
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
    <div class="main-center col-span-3 space-y-4">

      <div v-if="post.id" class="p-4 bg-white border border-gray-200 rounded-lg">
        <FeedItem :post="post" />
      </div>

      <div v-for="comment in post.comments" :key="comment.id" class="p-4 ml-6 bg-white border border-gray-200 rounded-lg">
        <CommentItem :comment="comment" />
      </div>

      <div class="bg-white border border-gray-200 rounded-lg">

        <vee-form @submit="onCommentSubmition" :validation-schema="commentSchema">
          <div class="p-4">  
            <vee-field as="textarea" name="body"
              class="p-4 w-full bg-gray-100 rounded-lg" 
              placeholder="What do you think?" 
            />

            <ErrorMessage class="text-lg text-red-500" name="body" />
          </div>

          <div class="p-4 border-t border-gray-100">
            <button type="submit" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg" :disabled="comment_in_submission">
              Comment
            </button>
          </div>
        </vee-form>

      </div>
    </div>

    <div class="main-right col-span-1 space-y-4">
      <PeopleYouMayKnow />

      <Trends />
    </div>
  </div>
</template>