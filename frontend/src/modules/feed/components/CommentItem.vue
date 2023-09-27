<script lang="ts" setup>
  import type { Comment } from '../interfaces/CommentsType'

  defineProps<{ comment: Comment }>()
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center space-x-6">

        <div class="w-[40px] h-[40px] rounded-full overflow-hidden">
          <img :src="comment.created_by.get_avatar" class="object-cover object-center w-full h-full" />
        </div>
        
        <p><strong>
          <router-link :to="{ name: 'profile', params: { id: comment.created_by.id } }">
            {{ comment.created_by.name }}
          </router-link>
        </strong></p>

      </div>

      <p class="text-gray-600">{{ comment.created_at_formatted }} ago</p>
    </div>

    <p>{{ comment.body }}</p> 
  </div>
</template>