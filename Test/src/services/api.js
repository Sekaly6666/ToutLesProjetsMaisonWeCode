import axios from 'axios'
import { useAuthStore } from '../store/authentification'

const api = axios.create({
  baseURL: 'https://api-contact.zoul.dev/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.state.token) {
    config.headers.Authorization = `Bearer ${authStore.state.token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response && error.response.status === 401) {
    const authStore = useAuthStore()
    authStore.logout()
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

export default api
