<script lang="ts" setup>
  import type { PostsType } from '../interfaces/PostsType'

  defineProps<{ comment: PostsType }>()
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center space-x-6">
          
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