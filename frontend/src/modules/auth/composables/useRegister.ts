import axios from 'axios'
import { ref } from 'vue'
import { useUserStore } from '../store/userStore'

export const useRegister = () => {
  const userStore = useUserStore()

  const reg_alert_color = ref('bg-blue-500') 
  const reg_alert_msg = ref('') 
  const reg_show_alert = ref(false) 
  const reg_in_submission = ref(false)

  const onRegister = async (values, { resetForm }) => {
    reg_alert_color.value = 'bg-blue-500'
    reg_alert_msg.value = 'Please wait! Your account is being created.'
    reg_show_alert.value = true
    reg_in_submission.value = true

    try {
      const { data } = await axios.post('/api/signup/', values)
      if (data?.message === 'success') {
        reg_alert_color.value = 'bg-green-500'
        reg_alert_msg.value = 'Success! Your account has been created.'
        reg_in_submission.value = false
      } else {
        reg_alert_color.value = 'bg-red-500'
        reg_alert_msg.value = data.detail || 'An unexpected error ocurred. Please try again later.'
      }
    } catch (error) {
      console.error(error)
    }

    userStore.toggleForm()

    setTimeout(() => {
      reg_in_submission.value = false
      resetForm()
    }, 7000)
  }

  const handleForm = () => userStore.toggleForm()

  return {
    reg_in_submission, reg_show_alert,
    reg_alert_color, reg_alert_msg,
    onRegister, handleForm
  }
}