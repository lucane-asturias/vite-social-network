<script lang="ts" setup>
  import PeopleYouMayKnow from '@/modules/feed/components/PeopleYouMayKnow.vue'
  import Trends from '@/modules/trend/components/Trends.vue'

  import { useFriends } from '../composables/useFriendsView'

  const {
    user, friends, friendshipRequests,
    getFriends, onFriendshipRequest
  } = useFriends()
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">

    <div class="main-left col-span-1">
      <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
        <div class="w-48 h-48 rounded-full overflow-hidden">
          <img :src="user.get_avatar" class="object-cover object-center w-full h-full" />
        </div>

        <p class="mt-5"><strong v-text="user.name" /></p>

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
            <div class="w-[180px] h-[180px] rounded-full overflow-hidden mb-6">
              <img :src="friendshipRequest.created_by.get_avatar" class="object-cover object-center w-full h-full" />
            </div>

            <p><strong>
              <router-link 
                :to=" { name: 'profile', params: { id: friendshipRequest.created_by.id} }"
                v-text="friendshipRequest.created_by.name" 
              />
            </strong></p>

            <div class="mt-6 flex space-x-8 justify-around">
              <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
              <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
            </div>

            <div class="mt-6 space-x-4">
              <button @click="onFriendshipRequest('accepted', friendshipRequest.created_by.id)"
                class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
                Accept
              </button>
              <button @click="onFriendshipRequest('rejected', friendshipRequest.created_by.id)"
                class="inline-block py-4 px-6 bg-red-600 text-white rounded-lg">
                Reject
              </button>
            </div>
          </div>

          <hr>
      </div>

      <div v-if="friends.length" class="p-4 bg-white border border-gray-200 rounded-lg grid grid-cols-2 gap-4">
        <div v-for="user in friends" :key="user.id" class="p-4 text-center bg-gray-100 rounded-lg">
          <div class="w-[180px] h-[180px] rounded-full overflow-hidden mb-6">
            <img :src="user.get_avatar" class="object-cover object-center w-full h-full" />
          </div>
      
          <p><strong>
            <router-link :to="{ name: 'profile', params:{ id: user.id } }" v-text="user.name" />
          </strong></p>

          <div class="mt-6 flex space-x-8 justify-around">
            <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
            <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
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
