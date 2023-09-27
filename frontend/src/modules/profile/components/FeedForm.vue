<script lang="ts" setup>
  import { computed, ref, reactive, onMounted  } from 'vue'

  import { useFeedFormStore } from '../stores/feedFormStore'

  const feedFormStore = useFeedFormStore()

  const bodyRef = ref<string>('')
  const profileSchema = reactive({ body: 'max:255' })

  const isSubmitButtonDisabled = computed(() => {
    return !bodyRef.value || feedFormStore.inSubmission
  })

  const selectImage = ($event) => {
    feedFormStore.onSelectImage($event)
    document.getElementById('fileRef').value = ''
  }
</script>

<template>
  <vee-form :validation-schema="profileSchema" @submit="feedFormStore.onPostCreation">
    <div class="p-4">  
      <vee-field as="textarea" name="body"
        v-model="bodyRef"
        class="p-4 w-full bg-gray-100 outline-violet-100 rounded-lg" 
        placeholder="What are you thinking about?"
      />
      <ErrorMessage class="text-lg text-red-500 mt-1 mb-6" name="body" />
    </div>

    <div class="p-4 border-t border-gray-100 flex justify-between">
      <transition name="fade" mode="out-in">
        <label v-if="feedFormStore.fileImage" type="text" @click="feedFormStore.closeImage"
          class="
            cursor-pointer transition-opacity duration-500 
            inline-block py-3 px-4 rounded-lg 
            bg-red-600 hover:bg-red-700 text-white
          "
        >Cancel image</label>
        <label v-else for="fileRef" type="text"
          class="
            cursor-pointer transition-opacity duration-500 
            inline-block py-3 px-4 rounded-lg 
            bg-gray-600 hover:bg-gray-700 text-white
          "
        >Attach image</label>
      </transition>
      <!-- Image selection simulator -->
      <input v-show="false" type="file"
        name="file" id="fileRef"
        accept="image/png, image/jpg, image/jpeg" 
        @change="selectImage($event)" 
      />

      <button type="submit" :disabled="isSubmitButtonDisabled" 
        class="inline-block py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
        Post
      </button>
    </div>
  </vee-form>

  <transition name="fade" mode="out-in">
    <figure v-if="feedFormStore.localImage">
      <img :src="feedFormStore.localImage" alt="form-image"
        class="
          fixed w-52 h-52 bottom-14 xl:bottom-16 right-12 xl:right-20
          border border-gray-400 hover:opacity-90
          object-cover object-center 
          img-preview
        "
      />
    </figure>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>