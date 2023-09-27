<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  import EditProfile from '../components/EditProfile.vue'
  import EditPassword from '../components/EditPassword.vue'

  const route = useRoute()
</script>

<template>
  <div id="edit-view">
    <EditProfile 
      v-if="
        route.query.mode === undefined || route.query.mode === 'profile'
      "
    />
    <EditPassword v-else />
  </div>
</template>