<script setup>
  import { reactive } from 'vue'
  import { useEditPassword } from '../composables/useEditPassword'

  const editPasswordSchema = reactive({
    old_password: 'required|min:3|max:32',
    new_password1: 'required|min:3|max:32',
    new_password2: 'passwords_mismatch:@new_password1',
  })

  const {
    edit_password_alert_color, edit_password_alert_msg,
    edit_password_in_submission, edit_password_show_alert,

    onEditPassword
  } = useEditPassword()
</script>

<template>
  <div class="max-w-7xl mx-auto grid grid-cols-2 gap-4">

    <div class="main-left">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <h1 class="mb-6 text-2xl">Edit password</h1>

        <p class="mb-6 text-gray-500">
          Here you can change your password

          Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
          Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
        </p>

        <router-link :to="{ name: 'profile_edit', query: { mode: 'profile' } }"  class="text-xl underline">
          Edit profile
        </router-link>
      </div>
    </div>

    <div class="main-right">
      <div class="p-12 bg-white border border-gray-200 rounded-lg">
        <div class="text-white text-center font-bold p-5 mb-8 rounded" v-if="edit_password_show_alert" :class="edit_password_alert_color">
          {{ edit_password_alert_msg }}        
        </div>

        <vee-form class="space-y-6" :validation-schema="editPasswordSchema" @submit="onEditPassword">

          <div>
            <label>Old password</label><br>
            <vee-field type="password" name="old_password" 
              class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg"
              placeholder="Your old password"
            />
            <ErrorMessage class="text-lg text-red-500 mt-1 mb-6" name="old_password" />
          </div>

          <div>
            <label>New password</label><br>
            <vee-field type="password" name="new_password1" 
              class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg"
              placeholder="Your new password"
            />
            <ErrorMessage class="text-lg text-red-500 mt-1 mb-6" name="new_password1" />
          </div>
          
          <div>
            <label>Repeat password</label><br>
            <vee-field type="password" name="new_password2" 
              class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg"
              placeholder="Repeat password" 
            />
            <ErrorMessage class="text-lg text-red-500 mt-1 mb-6" name="new_password2" />
          </div>

          <div>
            <button type="submit" :disabled="edit_password_in_submission"
              class="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              Save changes
            </button>
          </div>

        </vee-form>

      </div>
    </div>

  </div>
</template>