<script setup>
  import { ref, computed } from 'vue'
  import LoginForm from '../components/LoginForm.vue'
  import RegisterForm from '../components/RegisterForm.vue'

  import { useUserStore } from '../store/userStore'
  
  const userStore = useUserStore()

  const changeForm = computed(() => userStore.changeForm)
</script>

<template>
  <div id="auth-view">
    <LoginForm v-if="!changeForm" />

    <RegisterForm v-else />
  </div>
</template>