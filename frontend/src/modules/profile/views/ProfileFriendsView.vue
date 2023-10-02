<script lang="ts" setup>
  import PeopleYouMayKnow from '@/modules/feed/components/PeopleYouMayKnow.vue'
  import Trends from '@/modules/trend/components/Trends.vue'

  import { useFriends } from '../composables/useFriendsView'

  const {
    user, friends, friendshipRequests,
    getFriends, onFriendshipRequest,
    requestPending
  } = useFriends()
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">

    <div class="main-left md:col-span-1 mx-auto">
      <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
        <div class="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden">
          <img :src="user.get_avatar" class="object-cover object-center w-full h-full" />
        </div>

        <p class="mt-5 text-lg md:text-xl lg:text-2xl"><strong v-text="user.name" /></p>

        <div 
          class="mt-4 md:mt-6 flex flex-col md:flex-row space-y-2 md:space-y-0
            md:space-x-4 items-center justify-center">
          <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
          <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
        </div>
      </div>
    </div>

    <div class="main-center col-span-2 space-y-4">
      <div v-if="friendshipRequests.length && requestPending" class="p-4 bg-white border border-gray-200 rounded-lg">
        <h2 class="mb-6 text-xl text-center">Friendship requests</h2>

        <div 
          v-for="friendshipRequest in friendshipRequests" 
          :key="friendshipRequest.id" 
          class="p-4 text-center bg-gray-100 rounded-lg"
        >
          <figure class="w-32 h-32 md:w-38 md:h-38 lg:w-48 lg:h-48 rounded-full overflow-hidden mx-auto">
            <img :src="friendshipRequest.created_by.get_avatar" class="object-cover object-center w-full h-full" />
          </figure>

          <p class="mt-4 text-lg md:text-xl"><strong>
            <router-link 
              :to=" { name: 'profile', params: { id: friendshipRequest.created_by.id} }"
              v-text="friendshipRequest.created_by.name" 
            />
          </strong></p>

          <div class="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center justify-center">
            <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
            <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
          </div>

          <div class="mt-4 space-x-4">
            <button @click="onFriendshipRequest('accepted', friendshipRequest.created_by.id)"
              class="inline-block py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Accept
            </button>
            <button @click="onFriendshipRequest('rejected', friendshipRequest.created_by.id)"
              class="inline-block py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Reject
            </button>
          </div>
        </div>
      </div>

      <div id="friends">
        <div v-if="friends.length" class="p-4 bg-white border border-gray-200 rounded-lg text-center">
          <h2 class="mb-4 text-xl">Friends</h2>

          <div class="grid grid-cols-2 gap-4 bg-gray-100 py-1.5">
            <div 
              class="flex flex-col space-y-4 items-center" 
              v-for="user in friends"
              :key="user.id"
            >
              <div class="p-4 text-center rounded-lg">

                <figure class="w-32 h-32 md:w-38 md:h-38 lg:w-48 lg:h-48 rounded-full overflow-hidden mb-4 mx-auto">
                  <img :src="user.get_avatar" class="object-cover object-center w-full h-full" />
                </figure>

                <p><strong>
                  <router-link 
                    :to="{ name: 'profile', params:{ id: user.id } }"
                    v-text="user.name"
                  />
                </strong></p>

                <div class="mt-2 flex flex-col space-y-2 items-center">
                  <p class="text-xs text-gray-500">{{ user.friends_count }} friends</p>
                  <p class="text-xs text-gray-500">{{ user.posts_count }} posts</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="main-right md:col-span-1 space-y-4">
      <PeopleYouMayKnow />

      <Trends />
    </div>

  </div>
</template>
