<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import LoginForm from '../components/LoginForm.vue'
  import RegisterForm from '../components/RegisterForm.vue'

  const route = useRoute()
</script>

<template>
  <div id="auth-view">
    <LoginForm 
      v-if="
        route.query.mode === undefined || route.query.mode === 'login'
      " 
    />

    <RegisterForm v-else />
  </div>
</template>