<script lang="ts" setup>
  import FeedItem from '@/modules/feed/components/FeedItem.vue'
  import PeopleYouMayKnow from '@/modules/feed/components/PeopleYouMayKnow.vue'
  import Trends from '@/modules/trend/components/Trends.vue'
  import { useSearchView } from '../composables/useSearchView'
  import type { User, Post } from '@/modules/profile/interfaces/ResponseType'

  const { users, posts, searchInSubmission, onSearchQuery }: {
    users: User[], posts: Post[], searchInSubmission: boolean, onSearchQuery: Function
  } = useSearchView()
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
    <div class="main-left col-span-3 space-y-4">

      <div class="bg-white border border-gray-200 rounded-lg">
        <vee-form @submit="onSearchQuery" class="p-4 flex space-x-4">  
          <vee-field type="search" name="query" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="What are you looking for?" />
          <ErrorMessage class="text-lg text-red-500" name="query" />

          <button type="submit" :disabled="searchInSubmission" class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
            </svg>    
          </button>
        </vee-form>
      </div>

      <div v-if="users.length" class="p-4 bg-white border border-gray-200 rounded-lg grid grid-cols-4 gap-4">
        <div v-for="user in users" :key="user.id"
          class="p-4 text-center bg-gray-100 rounded-lg"
        >
          <img :src="user.created_by" class="mb-6 rounded-full">
          
          <p><strong>
            <router-link :to="{ name: 'profile', params: { id: user.id } }">
              {{ user.name }}
            </router-link>
          </strong></p>

          <div class="mt-6 flex space-x-8 justify-around">
            <p class="text-xs text-gray-500">
              {{ user.friends_count }} friends
            </p>
            <p class="text-xs text-gray-500">
              {{ user.posts_count }} posts
            </p>
          </div>
        </div>
        
      </div>

      <div v-for="post in posts" :key="post.id" 
        class="p-4 bg-white border border-gray-200 rounded-lg">
       <FeedItem :post="post" />   
      </div>

    </div>

    <div class="main-right col-span-1 space-y-4">
      <PeopleYouMayKnow />
      <Trends />
    </div>

  </div>
</template>