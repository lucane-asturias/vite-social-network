import axios from 'axios'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import type { PostType } from '../interfaces/PostType'
import { useFeedStore } from '../stores/feedStore'
import { useProfileStore } from '@/modules/profile/stores/profileStore'
import { useToastStore } from '@/store/toastStore'

export function useFeedItem() {
  const feedStore = useFeedStore()
  const profileStore = useProfileStore()
  const toastStore = useToastStore()

  const isLiked = ref<boolean>(false)
  const inSubmission = ref<boolean>(false)
  const showModal = ref<boolean>(false)

  const likePost = async (id: string) => {
    try {
      const { data } = await axios.post(`/api/posts/${id}/like/`) as { data: { message: string } }

      if (data.message === 'like incremented') {
        props.post.likes_count++
        isLiked.value = true
      }
      else {
        props.post.likes_count--
        isLiked.value = false
      }
    } catch (error) {
      console.error('[FeedItem.vue] likePost function error --- ', error)
    }
  }

  const onReportPost = async (id: string) => {
    if (inSubmission.value) return

    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'You really want to report this post?',
      showCancelButton: true,
      confirmButtonColor: '#12299B',
      cancelButtonColor: '#C62222',
      confirmButtonText: 'Report',
      cancelButtonText: `Cancel`,
    })

    if (isConfirmed) {
      inSubmission.value = true
      const loadingModal = Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      })

      try {
        const { data } = await axios.post(`/api/posts/${id}/report/`) as { data: { message: string } }

        if (data.message === 'post reported') {
          toastStore.showToast(5000, 'The post was reported', 'bg-emerald-500')
        } else {
          toastStore.showToast(3000, 'This post was already reported', 'bg-red-500')
        }
      } catch (error) {
        console.error("onReportPost error", error)
        inSubmission.value = false
        toggleModal()
      } finally {
        toggleModal()
        loadingModal.close()
        inSubmission.value = false
      }
    }
  }

  const onDeletePost = async (id: string) => {
    if (inSubmission.value) return

    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, the post cannot be restored.',
      showCancelButton: true,
      confirmButtonColor: '#12299B',
      cancelButtonColor: '#C62222',
      confirmButtonText: 'Delete',
      cancelButtonText: `Cancel`,
    })

    if (isConfirmed) {
      inSubmission.value = true
      const loadingModal = Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      })

      try {
        const { data } = await axios.delete(`/api/posts/${id}/delete/`) as { data: { message: string } }

        feedStore.deletePost(id)
        profileStore.deletePost(id)

        toastStore.showToast(5000, 'The post was deleted', 'bg-emerald-600')
      } catch (error) {
        console.error("deletePost error", error)
        toggleModal()
        loadingModal.close()
        inSubmission.value = false
      } finally {
        toggleModal()
        loadingModal.close()
        inSubmission.value = false
      }
    }
  }

  const toggleModal = () => 
    showModal.value = !showModal.value

  return {
    showModal, 
    likePost, toggleModal, inSubmission,
    onReportPost, onDeletePost,
  }
}