<script setup>
  import { useToastStore } from '@/store/toastStore'
  const toastStore = useToastStore()
</script>

<template>
  <div
    v-if="toastStore.showToast"
    class="
      fixed top-full right-8 
      px-6 py-6 rounded-xl shadow-xl
      transition ease-in-out delay-500 duration-500 
    "
    :class="toastStore.classes"
    v-text="toastStore.message"
  />
</template>