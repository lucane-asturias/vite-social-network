import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { NotificationsType } from '../interfaces/NotificationsType'

export const useNotifications = () => {
  const notifications = ref([])
  const router = useRouter()

  const getNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications/') as { data: NotificationsType }
      notifications.value = data
    } catch (error) {
      console.log('getNotifications error:  ', error)
    }
  }

  const readNotification = async (notification: string) => {
    try {
      const { data } = await axios.post(`/api/notifications/read/${notification.id}/`) as { data: { message: string } }

      if (
        notification.type_of_notification == 'post_like' ||
        notification.type_of_notification == 'post_comment'
      ) {
        router.push({ name: 'post', params: { id: notification.post_id } })
      } else {
        router.push({ name: 'friends', params: { id: notification.created_for_id } })
      }
    } catch (error) {
      console.log('readNotification error: ', error)
    }
  }

  onMounted(async () => await getNotifications())

  return {
    notifications,
    getNotifications,
    readNotification,
  }
}
