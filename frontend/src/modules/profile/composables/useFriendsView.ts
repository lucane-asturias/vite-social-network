import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/modules/auth/store/userStore'
import type { FriendsType } from '@/modules/feed/interfaces/FriendsType'

export function useFriends() {
  const userStore = useUserStore()
  const route = useRoute()

  const user = ref({})
  const friends = ref([])
  const friendshipRequests = ref([])

  const getFriends = async () => {
    try {
      const { data } = await axios.get(
        `/api/friends/${route.params.id}/`
      ) as { data: FriendsType }

      friendshipRequests.value = data.requests
      friends.value = data.friends
      user.value = data.user
    } catch (error) {
      console.log('error', error)
    }
  }

  const onFriendshipRequest = async (status, pk) => {
    console.log('onFriendshipRequest', status)
    try {
      const { data } = await axios.post(`/api/friends/${pk}/${status}/`) as { data: { message: string } }
    } catch (error) {
      console.log('error', error)
    }
  }

  onMounted(async () => await getFriends())

  return {
    user, friends, friendshipRequests,
    getFriends, onFriendshipRequest
  }
}
