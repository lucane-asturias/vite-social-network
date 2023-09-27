import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/store/toastStore'
import { useUserStore } from '@/modules/auth/store/userStore'
import type { EditProfileType } from '../interfaces/EditProfileType'

const fileRef = ref<null | HTMLInputElement>(null)
const inSubmission = ref<boolean>(false)

export const useEditProfile = () => {
  const toastStore = useToastStore()
  const userStore = useUserStore()
  const router = useRouter()

  const onEditProfile = async (values) => {
    inSubmission.value = true
    
    let formData = new FormData()
    formData.append('avatar', fileRef.value.files[0])
    formData.append('name', values.name)
    formData.append('email', values.email)

    try {
      const { data } = await axios.post('/api/editprofile/', formData, {
        headers: { "Content-Type": "multipart/form-data", }
      }) as { data: EditProfileType }

      if (data.message === 'information updated') {
        toastStore.showToast(5000, 'The information was saved', 'bg-emerald-600')

        userStore.setUserInfo({
          id: userStore.user.id,
          name: values.name,
          email: values.email,
          avatar: data.user.get_avatar
        })

        router.push({ name: 'profile', params: { id: userStore.user.id } })
      } else {
        toastStore.showToast(5000, `${data.message}. Please try again`, 'bg-red-600')
      }

      fileRef.value = null
      inSubmission.value = false
    } catch (error) {
      console.log('error', error)
      fileRef.value = null
      inSubmission.value = false
    }
  }

  return { inSubmission, fileRef, onEditProfile, userStore }
}