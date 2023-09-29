<script lang="ts" setup>
  import { computed, onMounted, ref, reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'

  import { useFeedStore } from '../stores/feedStore'

  import PeopleYouMayKnow from '../components/PeopleYouMayKnow.vue'
  import Trends from '@/modules/trend/components/Trends.vue'

  import FeedForm from '../components/FeedForm.vue'
  import FeedItem from '../components/FeedItem.vue'

  const route = useRoute()

  const feedStore = useFeedStore()
  const { posts } = storeToRefs(feedStore)

  onMounted(async () => await feedStore.getPostsFeed())

  const shouldRenderChildView = computed(() => route.name === 'post')
</script>

<template>
  <div>
    <router-view v-if="shouldRenderChildView" />

    <div v-else class="max-w-7xl mx-auto space-y-4 p-4 md:grid md:grid-cols-4 md:gap-4">

      <!-- Main Content -->
      <div class="main-center md:col-span-3">
        <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <!-- Feed Form -->
          <FeedForm />
        </div>

        <div v-for="post in posts" :key="post.id" class="bg-white border border-gray-200 rounded-lg p-4 mt-4">
          <!-- Feed Item -->
          <FeedItem :post="post" />
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="maion-right md:col-span-1 space-y-4">
        <PeopleYouMayKnow />

        <Trends />
      </div>
    </div>

  </div>
</template>
