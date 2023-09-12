<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import PeopleYouMayKnow from '../components/PeopleYouMayKnow.vue'
  import Trends from '../components/Trends.vue'
  import FeedItem from '../components/FeedItem.vue'
  import { useFeedView } from '../composables/useFeedView'
  import type { PostsType } from '../interfaces/PostsType'

  const feedSchema = reactive({
    body: 'required|min:3|max:255'
  })

  const { posts, getPostsFeed, onPostSubmition }: { 
    posts: PostsType[], 
    getPostsFeed: Function, 
    onPostSubmition: Function 
  } = useFeedView()

  onMounted(async () => await getPostsFeed())
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
    <div class="main-center col-span-3 space-y-4">
      <div class="bg-white border border-gray-200 rounded-lg">
        <vee-form :validation-schema="feedSchema" @submit="onPostSubmition">

          <div class="p-4">  
            <vee-field as="textarea" name="body"
              class="p-4 w-full bg-gray-100 rounded-lg" 
              placeholder="What are you thinking about?" 
            />
            <ErrorMessage class="text-lg text-red-500" name="body" />
          </div>

          <div class="p-4 border-t border-gray-100 flex justify-between">
            <a href="#" class="inline-block py-4 px-6 bg-gray-600 text-white rounded-lg">Attach image</a>

            <button type="submit" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">Post</button>
          </div>
        </vee-form>
      </div>

      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="p-4 bg-white border border-gray-200 rounded-lg"
      >
        <FeedItem :post="post" />
      </div>

    </div>

    <div class="main-right col-span-1 space-y-4">
      <PeopleYouMayKnow />

      <Trends />
    </div>
  </div>
</template>