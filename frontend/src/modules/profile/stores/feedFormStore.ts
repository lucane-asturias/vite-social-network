import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useProfileStore } from './profileStore'

export const useFeedFormStore = defineStore('feedFormStore', () => {

  const profileStore = useProfileStore()

  // State Properties ============================

  const isPrivate = ref<boolean>(false)
  const fileImage = ref<boolean | undefined | File>(false)
  const localImage = ref<boolean | string>(false)
  const inSubmission = ref<boolean>(false)

  // Actions =====================================

  function resetRefs() {
    fileImage.value = undefined
    localImage.value = false
    inSubmission.value = false
  }

  function setChecked(booleanValue) {
    isPrivate.value = booleanValue
  }

  const closeImage = () => resetRefs()

  function onSelectImage(event: Event<HTMLInputElement>) {
    
    if (event.target.files.length === 0) {
      localImage.value = false
      fileImage.value = undefined
      return
    }

    const fileTemp: File = event.target.files[0]

    if (
      (fileTemp.type === 'image/jpg') || 
      (fileTemp.type === 'image/jpeg') || 
      (fileTemp.type === 'image/png')
    ) {
      fileImage.value = fileTemp

      const reader = new FileReader()
      reader.onload = () => localImage.value = reader.result
      reader.readAsDataURL(fileImage.value)
    } else {
      alert('Invalid file type. Upload an image in JPG or PNG format.')
      localImage.value = false
      fileImage.value = undefined
    }
  }

  async function onPostCreation(values: { body: string }, resetForm: Function) {
    if (inSubmission.value) return
    inSubmission.value = true

    let formData = new FormData()
    formData.append('image', fileImage.value)
    formData.append('body', values.body)
    formData.append('is_private', isPrivate.value)

    try {
      const { data } = await axios.post('/api/posts/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }) as { data: PostType }

      profileStore.addNewPost(data)

      resetForm()
      resetRefs()
    } catch (error) {
      resetForm()
      resetRefs()
      console.error('feedview -- error', error)
    }
  }

  return { 
    fileImage, inSubmission, localImage,
    closeImage, onPostCreation, onSelectImage, setChecked
  }
})