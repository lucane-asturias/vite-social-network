<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { useChat } from '../composables/useChat'
  import { useUserStore } from '@/modules/auth/store/userStore'

  const userStore = useUserStore()
  
  const chatSchema = reactive({ body: 'max:255' })

  const { 
    onversations, activeConversation, chatInSubmission, 
    getConversationList, getMessages, setActiveConversation, onMessageSubmition
  } = chatSchema()

  onMounted(async () => await getConversationList())
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-4 gap-4">

    <div class="main-left col-span-1">
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="space-y-4">
          <div 
              v-for="conversation in conversations" :key="conversation.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2 cursor-pointer" @click="setActiveConversation(conversation.id)">
                <div v-for="user in conversation.users" :key="user.id">
                  <img :src="user.get_avatar" class="w-[40px] rounded-full ml-1">

                  <p v-if="user.id !== userStore.user.id" 
                    class="text-xs font-bold" v-text="user.name" />
                </div>
              </div>
              
              <span class="text-xs text-gray-500 ml-5 md:ml-8 xl:ml-5">{{ conversation.modified_at_formatted }} ago</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-center col-span-3 space-y-4">

      <div class="bg-white border border-gray-200 rounded-lg">
        <div class="flex flex-col flex-grow p-4">
          <template v-for="message in activeConversation.messages" :key="message.id">

            <div v-if="message.created_by.id === userStore.user.id"
                class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end">
              <div>
                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                  <p class="text-sm" v-text="message.body" />
                </div>
                <span class="text-xs text-gray-500 leading-none">
                  {{ message.created_at_formatted }} ago
                </span>
              </div>
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                <img :src="message.created_by.get_avatar" class="w-[40px] rounded-full">
              </div>
            </div>

            <div v-else class="flex w-full mt-2 space-x-3 max-w-md">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                <img :src="message.created_by.get_avatar" class="w-[40px] rounded-full ml-1">
              </div>
              <div>
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

      <div class="bg-white border border-gray-200 rounded-lg">
        <vee-form @submit="onMessageSubmition" :validation-schema="chatSchema">
          <div class="p-4">  
            <vee-field as="textarea" name="body" 
              class="p-4 w-full bg-gray-100 rounded-lg"
              placeholder="What do you want to say?"
            />
          </div>

          <div class="p-4 border-t border-gray-100 flex justify-between">
            <button :disabled="chatInSubmission"
              type="submit" 
              class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">
              Send
            </button>
          </div>
        </vee-form>
      </div>

    </div>
  </div>
</template>