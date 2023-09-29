<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">
    <div class="main-center col-span-3 space-y-4">
      <div 
          class="p-4 bg-white border border-gray-200 rounded-lg"
          v-for="notification in notifications"
          :key="notification.id"
          v-if="notifications.length"
      >
        {{ notification.body }} 

        <button class="underline" @click="readNotification(notification)">Read more</button>
      </div>

      <div v-else class="p-4 bg-white border border-gray-200 rounded-lg">
          You don't have any unread notifications!
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useNotifications } from '../composables/useNotifications'

  const { notifications, getNotifications, readNotification } = useNotifications()
</script>