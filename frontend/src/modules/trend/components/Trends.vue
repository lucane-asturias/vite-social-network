<script lang="ts" setup>
  import axios from 'axios'
  import { onMounted, ref } from 'vue'

  type TrendsType = { id: number, hashtag: string, occurences: number }

  const trends = ref<null | TrendsType[]>(null)

  onMounted(async () => await getTrends())

  const getTrends = async () => {
    try {
      const { data } = await axios.get('/api/posts/trends/') as { data: TrendsType[] }
      console.log('data trends', data)
      trends.value = data
    } catch(error) {
      console.error('[Trends.vue] getTrends error: ', error)
    }
  }
</script>

<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg">
    <h3 class="mb-6 text-xl">Trends</h3>

    <div class="space-y-4">

      <div v-for="trend in trends" :key="trend.id" class="flex items-center justify-between">
        <p class="text-xs">
          <strong>#{{ trend.hashtag }}</strong><br>
          <span class="text-gray-500">{{ trend.occurences }} posts</span>
        </p>

        <router-link 
          :to="{ name: 'trends', params: { id: trend.hashtag } }"
          class="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg"
        >
          Explore
        </router-link>
      </div>

    </div>
    
  </div>
</template>