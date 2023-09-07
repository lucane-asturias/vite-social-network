import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

export const useLogin = () => {
  const userStore = useUserStore()
  const router = useRouter()

  const login_alert_color = ref('bg-blue-500') 
  const login_alert_msg = ref('') 
  const login_show_alert = ref(false) 
  const login_in_submission = ref(false) 

  const onLogin = async (values, { resetForm }) => {
    login_alert_color.value = 'bg-blue-500'
    login_alert_msg.value = 'Please wait! We are logging you in.'
    login_show_alert.value = true
    login_in_submission.value = true

    try {
      const { data } = await axios.post('/api/login/', values)

      login_alert_color.value = 'bg-green-500'
      login_alert_msg.value = 'Success! You are now logged in.'

      userStore.setToken(data)

      axios.defaults.headers.common["Authorization"] = "Bearer " + data.access
    } catch (error) {
      console.error(error)
      login_alert_color.value = 'bg-red-500'
      login_in_submission.value = false
      login_alert_msg.value =  error.response?.data.detail || 'Invalid login details.'
      return
    }

    try {
      const { data } = await axios.get('/api/me')

      userStore.setUserInfo(data)
      router.push({ name: 'feed' })
    } catch (error) {
      console.error(error)
      login_alert_color.value = 'bg-red-500'
      login_alert_msg.value = error.response?.data.detail || 'Uh oh, something went wrong'
    }

    setTimeout(() => {
      login_in_submission.value = false
      resetForm()
    }, 7000)
  }

  const handleForm = () => userStore.changeForm()

  return {
    login_in_submission, login_show_alert,
    login_alert_color, login_alert_msg,
    onLogin, handleForm
  }
}