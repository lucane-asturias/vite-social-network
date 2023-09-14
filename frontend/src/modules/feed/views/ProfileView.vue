<script lang="ts" setup>
  import { onMounted, reactive, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import PeopleYouMayKnow from '../components/PeopleYouMayKnow.vue'
  import Trends from '../components/Trends.vue'
  import FeedItem from '../components/FeedItem.vue'
  import { useProfileView } from '../composables/useProfileView'
  import type { User, Post } from '../interfaces/ResponseType'
  import { useUserStore } from '@/modules/auth/store/userStore'

  const route = useRoute()
  const userStore = useUserStore()

  const profileSchema = reactive({ body: 'max:255' })

  const { 
    user, posts, getUserFeedByRouteId, 
    onPostCreation, sendFriendshipRequest, onLogOut
  } = useProfileView()

  watch(() => 
    route.params.id, async () => await getUserFeedByRouteId(), { 
      deep: true, immediate: true 
  }) 
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
    <div class="main-left col-span-1">
      <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
        <img src="https://i.pravatar.cc/300?img=70" class="mb-6 rounded-full" />
        
        <p><strong v-text="user.name" /></p>

        <div class="mt-6 flex space-x-8 justify-around">
          <router-link
            class="text-xs text-gray-500"
            :to="{ name: 'friends', params: { id: user.id } }"
          >
            {{ user.friends_count ? user.friends_count : '0' }} friends
          </router-link>
          <p class="text-xs text-gray-500">120 posts</p>
        </div>

        <div class="mt-6">
          <button @click="sendFriendshipRequest"
            class="inline-block py-4 px-3 bg-purple-600 text-xs text-white rounded-lg" 
            v-if="userStore.user.id !== user.id"
          >
            Send friendship request
          </button>

          <button @click="onLogOut"
            class="inline-block py-4 px-3 bg-red-600 text-xs text-white rounded-lg" 
            v-if="userStore.user.id === user.id"
          >
            Log out
          </button>
        </div>
      </div>
    </div>

    <div class="main-center col-span-2 space-y-4">
      <div v-if="userStore.user.id === user.id" class="bg-white border border-gray-200 rounded-lg">
        <vee-form @submit="onPostCreation" :validation-schema="profileSchema">
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

      <div v-for="post in posts" :key="post.id" class="p-4 bg-white border border-gray-200 rounded-lg">
        <FeedItem :post="post" />
      </div>
    </div>

    <div class="main-right col-span-1 space-y-4">
      <PeopleYouMayKnow />

      <Trends />
    </div>
  </div>
</template>