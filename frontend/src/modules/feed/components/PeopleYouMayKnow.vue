<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import type { User } from '../interfaces/PostType'
  import axios from 'axios'

  const users = ref<User[]>([])

  const getFriendsSuggestions = async () => {
    try {
      const { data } =  await axios.get(
        '/api/friends/suggestions/'
      ) as { data: User[] }

      users.value = data
    } catch (error) {
      console.error('getFriendsSuggestions error: ', error)
    }
  }

  onMounted(async () => await getFriendsSuggestions())
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg">
    <h3 class="mb-6 text-xl">People you may know</h3>

    <div class="space-y-4">

      <div v-for="user in users" :key="user.id" class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <figure class="w-11 h-11 rounded-full overflow-hidden mb-2 md:mb-0">
            <img :src="user.get_avatar" class="object-cover object-center w-full h-full">
          </figure>

          <p class="text-lg md:text-base font-semibold" v-text="user.name" />
        </div>

        <router-link 
          :to="{ name: 'profile', params: { id: user.id } }"
          class="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg md:text-sm"
        >Show</router-link>
      </div>

    </div>

  </div>
</template>