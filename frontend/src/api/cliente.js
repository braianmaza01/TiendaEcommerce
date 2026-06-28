import axios from 'axios'
import { API_URL } from '../utils/api'

const api = axios.create({ baseURL: `${API_URL}/api` })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('urbx_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('urbx_admin_token')
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
