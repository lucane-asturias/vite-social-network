<script lang="ts" setup>
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import PeopleYouMayKnow from '../components/PeopleYouMayKnow.vue'
  import Trends from '../components/Trends.vue'
  import { useUserStore } from '@/modules/auth/store/userStore'
  import type { RequestType } from '../interfaces/RequestType'

  const userStore = useUserStore()
  const route = useRoute()

  const user = ref({})
  const friendshipRequests = ref([])
  const friends = ref([])

  onMounted(async () => await getFriends())

  const getFriends = async () => {
    try {
      const { data } = await axios.get(
        `/api/friends/${route.params.id}/`
      ) as { data: RequestType }
      
      friendshipRequests.value = data.requests
      friends.value = data.friends
      user.value = data.user
    } catch (error) {
        console.log('error', error)
    }
  }

  const handleRequest = async (status, pk) => {
    console.log('handleRequest', status)
    try {
      const { data } = await axios.post(`/api/friends/${pk}/${status}/`) as { data: { message: string } }
    } catch (error) {
      console.log('error', error)
    }
  }
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">

    <div class="main-left col-span-1">
      <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
        <img src="https://i.pravatar.cc/300?img=70" class="mb-6 rounded-full">
        
        <p><strong v-text="user.name" /></p>

        <div class="mt-6 flex space-x-8 justify-around">
          <p class="text-xs text-gray-500">
            {{ user.friends_count }} friends
          </p>
          <p class="text-xs text-gray-500">120 posts</p>
        </div>
      </div>
    </div>

    <div class="main-center col-span-2 space-y-4">
      <div v-if="friendshipRequests.length" 
        class="p-4 bg-white border border-gray-200 rounded-lg">
        <h2 class="mb-6 text-xl">Friendship requests</h2>

        <div v-for="friendshipRequest in friendshipRequests" :key="friendshipRequest.id" 
          class="p-4 text-center bg-gray-100 rounded-lg">
            <img src="https://i.pravatar.cc/100?img=70" class="mb-6 mx-auto rounded-full">
        
            <p><strong>
              <router-link 
                :to=" { name: 'profile', params: { id: friendshipRequest.created_by.id} }"
                v-text="friendshipRequest.created_by.name" 
              />
            </strong></p>

            <div class="mt-6 flex space-x-8 justify-around">
              <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
              <p class="text-xs text-gray-500">120 posts</p>
            </div>

            <div class="mt-6 space-x-4">
              <button @click="handleRequest('accepted', friendshipRequest.created_by.id)"
                class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                Accept
              </button>
              <button @click="handleRequest('rejected', friendshipRequest.created_by.id)"
                class="inline-block py-4 px-6 bg-red-600 text-white rounded-lg">
                Reject
              </button>
            </div>
          </div>

          <hr>
      </div>

      <div v-if="friends.length" class="p-4 bg-white border border-gray-200 rounded-lg grid grid-cols-2 gap-4">
        <div v-for="user in friends" :key="user.id" class="p-4 text-center bg-gray-100 rounded-lg">
          <img src="https://i.pravatar.cc/300?img=70" class="mb-6 rounded-full">
      
          <p><strong>
            <router-link :to="{ name: 'profile', params:{ id: user.id } }" v-text="user.name" />
          </strong></p>

          <div class="mt-6 flex space-x-8 justify-around">
            <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
            <p class="text-xs text-gray-500">120 posts</p>
          </div>
        </div>
      </div>

    </div>

    <div class="main-right col-span-1 space-y-4">
      <PeopleYouMayKnow />

      <Trends />
    </div>
  </div>
</template>
