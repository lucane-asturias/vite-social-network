<script lang="ts" setup>
  import { computed, onMounted, ref, reactive } from 'vue'
  import PeopleYouMayKnow from '../components/PeopleYouMayKnow.vue'
  import Trends from '@/modules/trend/components/Trends.vue'
  import FeedItem from '../components/FeedItem.vue'
  import CommentItem from '../components/CommentItem.vue'

  import { usePostView } from '../composables/usePostView'

  const commentSchema = reactive({ body: 'max:255' })

  const bodyRef = ref<string>('')

  const {
    post, commentInSubmission, 
    getPosts, onCommentSubmition
  } = usePostView()

  onMounted(async () => await getPosts())

  const isSubmitButtonDisabled = computed<boolean>(() => {
    return !bodyRef.value || commentInSubmission.value
  })
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="main-center md:col-span-3 space-y-4">

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
              v-model="bodyRef"
              class="p-4 w-full bg-gray-100 rounded-lg" 
              placeholder="What do you think?" 
            />

            <ErrorMessage class="text-lg text-red-500" name="body" />
          </div>

          <div class="p-4 border-t border-gray-100">
            <button type="submit" class="inline-block py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg" :disabled="isSubmitButtonDisabled">
              Comment
            </button>
          </div>
        </vee-form>
      </div>
    </div>

    <div class="main-right md:col-span-1 space-y-4">
      <PeopleYouMayKnow />

      <Trends />
    </div>
  </div>
</template>