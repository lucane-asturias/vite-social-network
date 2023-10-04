<script lang="ts" setup>
  import { ref, onErrorCaptured } from 'vue'

  import NavbarMenu from '@/components/NavbarMenu.vue'
  import Toast from '@/components/Toast.vue'

  const error = ref(false)
  const errorMsgFromErrorCaptured = ref('Something went wrong. Check the logs!')

  onErrorCaptured((err, _vm, _info) => {
    console.error(err)
    error.value = true

    setTimeout(() => error.value = false, 10000)
    return false
  })
</script>

<template>
  <NavbarMenu />

  <main class="px-8 py-6 bg-gray-100">
    <router-view v-slot="{ Component }">
      <div v-if="error"
        class="bg-red-200 text-red-700 p-4 rounded-lg border-1 border-red-700" 
        v-text="errorMsgFromErrorCaptured"
      />
      <component :is="Component" />

    </router-view>
  </main>

  <Toast />
</template>