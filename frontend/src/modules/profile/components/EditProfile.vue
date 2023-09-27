<script lang="ts" setup>
  import { reactive } from 'vue'
  import { useEditProfile } from '../composables/useEditProfile'

  const { inSubmission, fileRef, onEditProfile, userStore } = useEditProfile()

  const defaultEditData = reactive({ 
    name: userStore.user.name,
    email: userStore.user.email
  })
  const editSchema = reactive({
    name: 'min:2|max:100|alpha_spaces',
    email: 'min:3|max:100|email'
  })
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

        <router-link :to="{ name: 'profile_edit', query: { mode: 'password' } }"
          class="text-xl underline">
          Edit password
        </router-link>
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
              class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="name" />
          </div>

          <div>
            <label>E-mail</label><br>
            <vee-field type="email" name="email" placeholder="Your e-mail address" 
              class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg" />
            <ErrorMessage class="text-lg text-red-500" name="email" />
          </div>

          <div>
            <label>Avatar</label><br>
            <input type="file" ref="fileRef">
          </div>

          <div>
            <button type="submit" :disabled="inSubmission" 
              class="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Save changes
            </button>
          </div>

        </vee-form>
      </div>
    </div>
  </div>
</template>