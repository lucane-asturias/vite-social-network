<script lang="ts" setup>
  import axios from 'axios'
  import { ref } from 'vue'
  import type { PostType } from '../interfaces/PostType'

  const props = defineProps<{ post: PostType }>()

  const isLiked = ref<boolean>(false)

  const likePost = async (id: string) => {
    try {
      const { data } = await axios.post(`/api/posts/${id}/like/`) as { data: { message: string } }

      if (data.message === 'like incremented') {
        props.post.likes_count++
        isLiked.value = true
      }
      else {
        props.post.likes_count--
        isLiked.value = false
      }
    } catch (error) {
      console.error('[FeedItem.vue] likePost function error --- ', error)
    }
  }
</script>

<template>
  <div class="mb-6 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
    <div class="flex items-center space-x-2">
      <div class="w-12 h-12 md:w-[40px] md:h-[40px] rounded-full overflow-hidden">
        <img :src="post.created_by.get_avatar" class="object-cover object-center w-full h-full" />
      </div>
      
      <p class="pl-1.5"><strong>
        <router-link 
          :to="{ name: 'profile', params: { id : post.created_by.id } }"
          v-text="post.created_by.name" />
      </strong></p>
    </div>

    <p class="text-gray-600 md:self-end">{{ post.created_at_formatted }} ago</p>
  </div>

  <template v-if="post.attachments.length">
    <img v-for="image in post.attachments" :key="image.id" :src="image.get_image" class="w-full mb-4 rounded-xl">
  </template>

  <p v-text="post.body" />

  <div class="my-6 flex justify-between">
    <div class="flex space-x-6">

      <div class="flex items-center space-x-2 cursor-pointer" @click="likePost(post.id)">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="w-6 h-6" :class="[{ isLiked: 'text-purple-600'}, post.likes_count === 1 ? 'text-purple-600' : '' ]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
        </svg>  
          
          <span class="text-gray-500 text-xs">{{ post.likes_count }} likes</span>
      </div>
        
      <router-link :to="{ name: 'post', params: { id: post.id } }" class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"></path>
        </svg> 

        <span class="text-gray-500 text-xs">{{ post.comments_count }}</span>
      </router-link>
    </div>
  
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"></path>
      </svg>   
    </div>   
  </div>  
</template>