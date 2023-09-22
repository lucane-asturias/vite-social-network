<script lang="ts" setup>
  import axios from 'axios'
  import { onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import PeopleYouMayKnow from '@/modules/feed/components/PeopleYouMayKnow.vue'
  import FeedItem from '@/modules/feed/components/FeedItem.vue'
  import Trends from '../components/Trends.vue'
  import type { TrendPostType } from '../interfaces/TrendPostType'

  const posts = ref<null | TrendPostType[]>(null)
  const route = useRoute()

  onMounted(async () => await getTrendById())

  const getTrendById = async () => {
    try {
      const { data } = await axios.get(
        `/api/posts/?trend=${route.params.id}`
      ) as { data: TrendPostType }
      posts.value = data
    } catch (error) {
      console.error('[TrendView.vue] getTrendById error: ', error)
    }
  }

  watch(
    () => route.params.id, 
    async () => await getTrendById(), 
    { deep: true, immediate: true }
  )

</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
    <div class="main-center col-span-3 space-y-4">

      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <h2 class="text-xl">Trend: #{{ route.params.id }}</h2>
      </div>
      
      <div 
          class="p-4 bg-white border border-gray-200 rounded-lg"
          v-for="post in posts"
          :key="post.id"
      >
        <FeedItem :post="post" />
      </div>
    </div>

    <div class="main-right col-span-1 space-y-4">
      <PeopleYouMayKnow />

      <Trends />
    </div>
  </div>
</template>
