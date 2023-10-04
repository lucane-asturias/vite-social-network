<script setup>
  import { ref } from 'vue'
  import { storeToRefs  } from 'pinia'
  import { useUserStore } from '@/modules/auth/store/userStore'

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const showMobileMenu = ref(false)

  const toggleMobileMenu = () => showMobileMenu.value = !showMobileMenu.value
</script>

<template>
  <nav class="py-4 px-4 sm:py-6 sm:px-8 border-b border-gray-200">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <div class="menu-left">
          <router-link to="/" class="text-xl">VSN</router-link>
        </div>

        <div class="menu-center flex">
          <!-- Links for larger screens -->
          <div class="hidden sm:flex space-x-4 sm:space-x-12">
            <router-link :to="{ name: 'feed' }" class="text-purple-700">
              <!-- Feed View -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6 hover:fill-current">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </router-link>

            <router-link :to="{ name: 'chat' }" class="text-purple-700">
              <!-- Chat View -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6 hover:fill-current">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
              </svg>
            </router-link>

            <router-link :to="{ name: 'notifications' }" class="text-purple-700">
              <!-- Notifications View -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6  hover:fill-current">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
              </svg>
            </router-link>

            <router-link :to="{ name: 'search' }" class="text-purple-700">
              <!-- Search View -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6 hover:fill-current">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
              </svg>
            </router-link>
          </div>

          <!-- Hamburger menu for smaller screens -->
          <div class="sm:hidden">
            <button @click="toggleMobileMenu" class="text-purple-700">
              <span class="text-lg">Menu</span>
            </button>
          </div>
        </div>

        <div class="menu-right">
          <template v-if="user.isAuthenticated && user.id">
            <router-link :to="{ name: 'profile', params: { id: user.id } }">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img :src="user.avatar" alt="User Avatar" class="object-cover object-center w-full h-full" />
              </div>
            </router-link>
          </template>
          
          <template v-else>
            <router-link 
              :to="{ name: 'auth', query: { mode: 'login' } }" 
              class="mr-2 py-2 px-4 sm:mr-4 sm:py-4 sm:px-6 bg-gray-600 text-white rounded-lg">
              Login
            </router-link>

            <router-link 
              :to="{ name: 'auth', query: { mode: 'register' } }"
              class="py-2 px-4 sm:py-4 sm:px-6 bg-purple-600 text-white rounded-lg"> Register
            </router-link>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile menu (shown when the screen is small) -->
    <div v-show="showMobileMenu" class="mt-4 sm:hidden">
      
      <router-link :to="{ name: 'feed' }" class="block py-2 px-4 text-purple-700">
        Feed
      </router-link>

      <router-link :to="{ name: 'chat' }" class="block py-2 px-4 text-purple-700">
        Chat
      </router-link>

      <router-link :to="{ name: 'notifications' }" class="block py-2 px-4 text-purple-700">
        Notifications
      </router-link>

      <router-link :to="{ name: 'search' }" class="block py-2 px-4 text-purple-700">
        Search
      </router-link>
    </div>
  </nav>
</template>