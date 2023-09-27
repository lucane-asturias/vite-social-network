import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useToastStore } from '@/store/toastStore'
import { useUserStore } from '@/modules/auth/store/userStore'

export const useEditPassword = () => {
  const router = useRouter()
  const toastStore = useToastStore()
  const userStore = useUserStore()

  const edit_password_alert_color = ref<string>('bg-blue-500')
  const edit_password_alert_msg = ref<string>('Please wait! Your password is being updated.')
  const edit_password_in_submission = ref<boolean>(false)
  const edit_password_show_alert = ref<boolean>(false) 

  const onEditPassword = async (values: {
    old_password: string,
    new_password1: string,
    new_password2: string
  }, { resetForm }) => {
    edit_password_alert_color.value = 'bg-blue-500'
    edit_password_in_submission.value = true
    edit_password_show_alert.value = true

    let formData = new FormData()
    formData.append('old_password', values.old_password)
    formData.append('new_password1', values.new_password1)
    formData.append('new_password2', values.new_password2)

    try {
      const { data } = await axios.post('/api/editpassword/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }) as { data: { message: any } }

      if (data.message === 'success') {
        toastStore.showToast(5000, 'The information was saved', 'bg-emerald-500')

        edit_password_alert_color.value = 'bg-green-500'
        edit_password_alert_msg.value = 'Success! Your password has been updated.'

        resetForm()

        setTimeout(() => router.push(`/profile/${userStore.user.id}`), 1000)
      } else {
        console.log('data after', data.message)
        const data = JSON.parse(data.message)
        console.log('data after', data)

        edit_password_alert_color.value = 'bg-red-500'
        edit_password_alert_msg.value = 'An unexpected error ocurred. Please try again later.'
        edit_password_in_submission.value = false
        edit_password_show_alert.value = false
      }
    } catch (error) {
      console.error('onEditPassword error', error)
      edit_password_alert_color.value = 'bg-red-500'
      edit_password_alert_msg.value = 'An unexpected error ocurred. Please try again later.'
      edit_password_in_submission.value = false
      edit_password_show_alert.value = false
    }
  }

  return {
    edit_password_alert_color, edit_password_alert_msg,
    edit_password_in_submission, edit_password_show_alert,

    onEditPassword
  }
}