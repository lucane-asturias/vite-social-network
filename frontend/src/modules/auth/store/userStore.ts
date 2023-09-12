import { defineStore } from 'pinia'
import axios from 'axios'

type UserInfo = { 
  id: string, name: string, 
  email: string, avatar?: string | null
}

interface UserType { 
  user: {
      isAuthenticated: boolean,
      name: string | null,
      id: string | null,
      email: string | null,
      access: string | null,
      refresh: string | null,
      avatar: string | null
  }
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      isAuthenticated: false,
      id: null,
      name: null,
      email: null,
      access: null,
      refresh: null,
      avatar: null
    }
  }) as UserType,
  actions: {
    async initStore() {
      console.log('initStore', localStorage.getItem('user.access'))

      if (localStorage.getItem('user.access')) {
        console.log('User has access!')

        this.user.access = localStorage.getItem('user.access')
        this.user.refresh = localStorage.getItem('user.refresh')
        this.user.id = localStorage.getItem('user.id')
        this.user.name = localStorage.getItem('user.name')
        this.user.email = localStorage.getItem('user.email')
        this.user.avatar = localStorage.getItem('user.avatar')
        this.user.isAuthenticated = true

        await this.refreshToken()

        console.log('Initialized user:', this.user)
      }
    },
    setToken(data: { refresh: string, access: string }) {
      console.log('setToken', data)

      this.user.access = data.access
      this.user.refresh = data.refresh
      this.user.isAuthenticated = true

      localStorage.setItem('user.access', data.access)
      localStorage.setItem('user.refresh', data.refresh)
    },
    setUserInfo(user: UserInfo) {
      console.log('setUserInfo', user)

      this.user.id = user.id
      this.user.name = user.name
      this.user.email = user.email
      this.user.avatar = user.avatar || null

      localStorage.setItem('user.id', this.user.id)
      localStorage.setItem('user.name', this.user.name)
      localStorage.setItem('user.email', this.user.email)
      localStorage.setItem('user.avatar', this.user.avatar! ?? null)

      console.log('User', this.user)
    },
    removeToken() {
      console.log('removeToken')

      this.$reset()
      localStorage.clear()
    },
    async refreshToken() {
      try {
        const { data } = await  axios.post('/api/refresh/', {
          refresh: this.user.refresh 
        })

        console.log('refreshtoken', data)

        this.user.access = data.access

        localStorage.setItem('user.access', data.access)
        // make all axios requests have that access token as an Authorization header 
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.access
      } catch (error) {
          console.log(error)
          this.removeToken()
      }
    },
  }
})