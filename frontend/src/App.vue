<script lang="ts" setup>
  import axios from 'axios'
  import { ref, onMounted, onErrorCaptured } from 'vue'

  import NavbarMenu from '@/components/NavbarMenu.vue'
  import { useUserStore } from '@/modules/auth/store/userStore'

  const userStore = useUserStore()

  onMounted(() => {
    userStore.initStore()
    const token = userStore.user.access
    
    axios.defaults.headers.common["Authorization"] = 
      `Bearer ${token ? token : ""}`
  })

  const error = ref(false)
  const errorMsg = ref()
  onErrorCaptured((error: unknown) => {
    console.warn(error)
    errorMsg.value = error
    error.value = true
    return false
  })
</script>

<template>
  <NavbarMenu />

  <main class="px-8 py-6 bg-gray-100">
    <router-view v-slot="{ Component }">
      <div v-if="error"
        class="bg-red-200 text-red-500 p-4 rounded-lg border-1 border-red-700" 
        v-text="errorMsg"
      />
      <component :is="Component" />

    </router-view>
  </main>
</template>