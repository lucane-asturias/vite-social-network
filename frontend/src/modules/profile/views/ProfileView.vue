<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'

  import { useProfileStore } from '../stores/profileStore'
  import { useUserStore } from '@/modules/auth/store/userStore'

  import PeopleYouMayKnow from '@/modules/feed/components/PeopleYouMayKnow.vue'
  import Trends from '@/modules/trend/components/Trends.vue'
  import FeedItem from '@/modules/feed/components/FeedItem.vue'

  import FeedForm from '../components/FeedForm.vue'
  import { useProfileView } from '../composables/useProfileView'

  const route = useRoute()
  const userStore = useUserStore()
  const profileStore = useProfileStore()
  const {
    user, posts, 
    inSubmission, inSubmissionLogout,
    canSendFriendshipRequest
  } = storeToRefs(profileStore)

  const shouldRenderChildView = computed(() => route.name === 'friends')

  watch(() => 
    route.params.id, async () => await profileStore.getUserFeedByRouteId(), { 
    deep: true
  })

  onMounted(async () => await profileStore.getUserFeedByRouteId())
</script>

<template>
  <div>
    <router-view v-if="shouldRenderChildView" />

    <div v-else class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Left Sidebar (Column 1) -->
      <div class="main-left md:col-span-1">
        <div class="p-4 bg-white border border-gray-200 text-center rounded-lg">
          <div class="w-32 h-32 md:w-38 md:h-38 lg:w-48 lg:h-48 rounded-full overflow-hidden mx-auto">
            <img :src="user.get_avatar" class="object-cover object-center w-full h-full" />
          </div>

          <p class="mt-5 text-xl md:text-xl lg:text-2xl"><strong v-text="user.name" /></p>

          <div class="mt-6 flex flex-col md:flex-row space-y-2 md:space-x-8 justify-center md:justify-between items-center mx-5">
            <router-link
              class="text-xs text-gray-500"
              :to="{ name: 'friends', params: { id: user.id } }"
            >
              {{ user.friends_count }} friends
            </router-link>
            <p class="text-xs text-gray-500 pb-1.5">{{ user.posts_count }} posts</p>
          </div>

          <div class="mt-6 space-y-4" v-if="!inSubmissionLogout">
            <template v-if="userStore.user?.id !== user.id">

              <button v-if="canSendFriendshipRequest" @click="profileStore.sendFriendshipRequest" :disabled="inSubmission"
                class="inline-block py-3 px-4 bg-purple-600 hover:bg-purple-700 text-sm text-white rounded-lg" 
              >
                Send friendship request
              </button>

              <button @click="profileStore.sendDirectMessage" :disabled="inSubmission"
                class="inline-block mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-lg" 
              >
                Send direct message
              </button>

            </template>
            <template v-else-if="userStore.user?.id === user.id">

              <router-link :to="{ name: 'profile_edit' }"
                class="inline-block mt-2 py-3 px-4 mr-2 bg-blue-600 hover:bg-blue-700 text-sm text-white rounded-lg" 
              >
                Edit profile
              </router-link>

              <button @click="profileStore.onLogOut" :disabled="inSubmissionLogout"
                class="inline-block mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-sm text-white rounded-lg" 
              >
                Log out
              </button>

            </template>
          </div>
        </div>
      </div>

      <!-- Main Content (Column 2 and 3) -->
      <div class="main-center md:col-span-2 space-y-4">
        <div v-if="userStore.user.id === user.id" class="bg-white border border-gray-200 rounded-lg">
          <!-- Feed Form -->
          <FeedForm />
        </div>

        <div v-for="post in posts" :key="post.id" class="p-4 bg-white border border-gray-200 rounded-lg">
          <FeedItem :post="post" />
        </div>
      </div>

      <!-- Right Sidebar (Column 4) -->
      <div class="main-right md:col-span-1 space-y-4">
        <PeopleYouMayKnow />

        <Trends />
      </div>
    </div>

  </div>
</template>