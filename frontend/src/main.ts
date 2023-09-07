import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VeeValidatePlugin from './includes/validation'

import './tailwind.css'

import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8000'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VeeValidatePlugin)
  .mount('#app')