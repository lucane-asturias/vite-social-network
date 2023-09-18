import axios from 'axios'
import { ref } from 'vue'
import type { ConversationsType, MessagesType, MessageSentType } from '../interfaces/ChatTypes'

export const useChat = () => {
  const conversations = ref<ConversationsType>([])
  const activeConversation = ref({})
  const chatInSubmission = ref<string>(false)

  const getConversationList = async () => {
    try {
      const { data } = await axios.get('/api/chat/') as { data: ConversationsType }
      conversations.value = data

      if (conversations.value?.length > 0) {
        activeConversation.value = conversations.value[0].id
        await getMessages()
      }
    } catch (error) {
      console.error('getConversationList ERROR --- ', error)
    }
  }

  const getMessages = async () => {
    try {
      const { data } = await axios.get(
        `/api/chat/${activeConversation.value}/`
      ) as { data: MessagesType }

      activeConversation.value = data
    } catch (error) {
      console.error('getMessages ERROR --- ', error)
    }
  }

  const setActiveConversation = async (id: string) => {
    if (id === activeConversation.value.id) return

    activeConversation.value = id
    await getMessages()
  }

  const onMessageSubmition = async (values: { body: string }, { resetForm }) => {
    chatInSubmission.value = true

    try {
      const { data } = await axios.post(
        `/api/chat/${activeConversation.value.id}/send/`, {
        body: values.body
      }) as { data: MessageSentType }

      activeConversation.value.messages.push(data)

      chatInSubmission.value = false
    } catch (error) {
      chatInSubmission.value = false
      console.error('onMessageSubmition error --- ', error)
    }
  }
  
  return {
    conversations, activeConversation, chatInSubmission, 
    getConversationList, getMessages, setActiveConversation, onMessageSubmition
  }
}