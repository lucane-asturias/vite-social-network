<script lang="ts" setup>
  import { computed, onMounted, ref, reactive } from 'vue'
  import { useChat } from '../composables/useChat'
  import { useUserStore } from '@/modules/auth/store/userStore'

  const userStore = useUserStore()

  const bodyRef = ref<string>('')
  
  const chatSchema = reactive({ body: 'max:255' })

  const { 
    conversations, activeConversation, chatInSubmission, 
    getConversationList, getMessages, setActiveConversation, onMessageSubmition
  } = useChat()

  onMounted(async () => await getConversationList())

  const isSubmitButtonDisabled = computed(() => {
    return !bodyRef.value || chatInSubmission.value
  })
</script>

<template>
  <div class="max-w-7xl mx-auto sm:grid sm:grid-cols-1 md:grid-cols-4 md:gap-4">

    <div class="main-left sm:col-span-1 mb-2">
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="space-y-4">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            class="flex items-center justify-between"
          >
            <div
              class="flex items-center space-x-2 cursor-pointer"
              @click="setActiveConversation(conversation.id)"
            >
              <div v-for="user in conversation.users" :key="user.id">
                <div class="w-10 h-10 rounded-full overflow-hidden">
                  <img :src="user.get_avatar" class="object-cover object-center w-full h-full" />
                </div>

                <p
                  class="text-xs font-semibold mt-1 text-center"
                  v-text="user.name"
                />
              </div>
            </div>

            <span class="text-xs text-gray-500 ml-2 md:ml-4 xl:ml-2">
              {{ conversation.modified_at_formatted }} ago
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="main-center sm:col-span-1 md:col-span-3 space-y-4">
      <!-- Chat Messages -->
      <div class="bg-white border border-gray-200 rounded-lg">
        <div class="flex flex-col flex-grow p-4 space-y-4">
          <div v-for="message in activeConversation.messages" :key="message.id">

            <template v-if="message.created_by.id === userStore.user.id">
              <div class="flex w-full mt-2 space-x-3 max-w-md justify-end ml-auto">
                <div class="order-1">
                  <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                    <p class="text-sm" v-text="message.body" />
                  </div>
                  <span class="text-xs text-gray-500 leading-none">
                    {{ message.created_at_formatted }} ago
                  </span>
                </div>
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 order-1">
                  <div class="w-10 h-10 rounded-full overflow-hidden">
                    <img :src="message.created_by.get_avatar" class="object-cover object-center w-full h-full" />
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="flex w-full mt-2 space-x-3 max-w-md">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 order-1">
                  <div class="w-10 h-10 rounded-full overflow-hidden">
                    <img :src="message.created_by.get_avatar" class="object-cover object-center w-full h-full" />
                  </div>
                </div>
                <div class="order-2">
                  <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                    <p class="text-sm" v-text="message.body" />
                  </div>
                  <span class="text-xs text-gray-500 leading-none">
                    {{ message.created_at_formatted }} ago
                  </span>
                </div>
              </div>
            </template>

          </div>
        </div>
      </div>

      <!-- Chat Input Form -->
      <div class="bg-white border border-gray-200 rounded-lg">
        <vee-form @submit="onMessageSubmition" :validation-schema="chatSchema">
          <div class="p-4">
            <vee-field as="textarea" name="body"
              v-model="bodyRef"
              class="p-4 w-full bg-gray-100 rounded-lg" 
              placeholder="What do you want to say?" 
            />

            <ErrorMessage class="text-lg text-red-500" name="bodyRef" />
          </div>

          <div class="p-4 border-t border-gray-200 flex justify-between">
            <button :disabled="isSubmitButtonDisabled" type="submit" class="inline-block py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              Send
            </button>
          </div>
        </vee-form>
      </div>
    </div>
  </div>
</template>
