import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useFeedStore } from '../stores/feedStore'
import type { PostType } from '../interfaces/PostType'

export const useFeedFormStore = defineStore('feedFormStore', () => {

  const feedStore = useFeedStore()

  // State Properties ============================

  const fileImage = ref<boolean | undefined | File>(false)
  const localImage = ref<boolean | string>(false)
  const inSubmission = ref<boolean>(false)

  // Actions ============================

  function resetRefs() {
    fileImage.value = undefined
    localImage.value = false
    inSubmission.value = false
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

  async function onPostCreation(values: { 
      body: string 
    }, { resetForm }) {
    inSubmission.value = true

    let formData = new FormData()
    formData.append('image', fileImage.value)
    formData.append('body', values.body)

    try {
      const { data } = await axios.post('/api/posts/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }) as { data: PostType }

      feedStore.addNewPost(data)

      resetForm()
      resetRefs()
    } catch (error) {
      resetRefs()
      console.error('feedview -- error', error)
    }
  }

  return { 
    fileImage, inSubmission, localImage,
    closeImage, onSelectImage, onPostCreation
  }
})