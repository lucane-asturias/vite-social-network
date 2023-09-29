<script lang="ts" setup>
  import axios from 'axios'
  import { ref, onBeforeMount, onErrorCaptured } from 'vue'

  import NavbarMenu from '@/components/NavbarMenu.vue'
  import Toast from '@/components/Toast.vue'
  import { useUserStore } from '@/modules/auth/store/userStore'

  const userStore = useUserStore()

  onBeforeMount(async () => {
    // Initialize the store before the app is created
    await userStore.initStore()
    const token = userStore.user.access

    // Configure Axios with the token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token || ''}`
  })

  const error = ref(false)
  const errorMsgFromErrorCaptured = ref('');

  onErrorCaptured((error, vm, info) => {
    console.error(error)
    error.value = true
    errorMsgFromErrorCaptured.value = String(error)
    return false
  })
</script>

<template>
  <NavbarMenu />

  <main class="px-8 py-6 bg-gray-100">
    <router-view v-slot="{ Component }">
      <div v-if="error"
        class="bg-red-200 text-red-500 p-4 rounded-lg border-1 border-red-700" 
        v-text="errorMsgFromErrorCaptured"
      />
      <component :is="Component" />

    </router-view>
  </main>

  <Toast />
</template>