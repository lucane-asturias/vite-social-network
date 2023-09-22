<script setup>
  import axios from 'axios'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToastStore } from '@/store/toast'
  import { useUserStore } from '@/modules/modules/auth/userStore'

  const toastStore = useToastStore()
  const userStore = useUserStore()
  const router = useRouter()

  const fileRef = ref()

  const defaultEditData = reactive({ 
    name: userStore.user.name,
    email: userStore.user.email
  })
  const editSchema = reactive({
    name: 'min:2|max:100|alpha_spaces',
    email: 'min:3|max:100|email'
  })

  const onEditProfile = async (values) => {
    let formData = new FormData()
    formData.append('avatar', fileRef.value.files[0])
    formData.append('name', values.name)
    formData.append('email', values.email)

    try {
      const { data } = await axios.post('/api/editprofile/', formData, {
        headers: { "Content-Type": "multipart/form-data", }
      })

      if (data.message === 'information updated') {
        toastStore.showToast(5000, 'The information was saved', 'bg-emerald-600')

        userStore.setUserInfo({
          id: userStore.user.id,
          name: values.name,
          email: values.email,
          avatar: data.user.get_avatar
        })

        router.back()
      } else {
        toastStore.showToast(5000, `${data.message}. Please try again`, 'bg-red-600')
      }
    } catch(error) {
      console.log('error', error)
    }
  }
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-2 gap-4">

    <div class="main-left">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <h1 class="mb-6 text-2xl">Edit profile</h1>

        <p class="mb-6 text-gray-500">
            Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
            Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
        </p>

        <router-link to="/profile/edit/password" class="underline">Edit password</router-link>
      </div>
    </div>

    <div class="main-right">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <vee-form 
            class="space-y-6" 
            :validation-schema="editSchema" 
            :initial-values="defaultEditData"
            @submit="onEditProfile" 
        >

          <div>
            <label>Name</label><br>
            <vee-field type="text" name="name" placeholder="Your full name"
              class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg">
            <ErrorMessage class="text-lg text-red-500" name="name" />
          </div>

          <div>
            <label>E-mail</label><br>
            <vee-field type="email" name="email" placeholder="Your e-mail address" 
              class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg">
            <ErrorMessage class="text-lg text-red-500" name="email" />
          </div>

          <div>
            <label>Avatar</label><br>
            <input type="file" ref="fileRef">
          </div>

          <div>
            <button type="submit" class="py-4 px-6 bg-purple-600 text-white rounded-lg">
              Save changes
            </button>
          </div>

        </vee-form>
      </div>
    </div>
  </div>
</template>