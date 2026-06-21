import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

let isLoggingOut = false

export const resetLogoutFlag = () => {
  isLoggingOut = false
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('[admin api] REQ:', config.method?.toUpperCase(), config.url, token ? '✓ token' : '✗ sin token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => {
    console.log('[admin api] RES:', response.status, response.config.url)
    const newToken = response.headers['x-new-token']
    if (newToken) {
      localStorage.setItem('token', newToken)
    }
    return response
  },
  (error) => {
    console.error('[admin api] ERR:', error.response?.status, error.config?.url, error.message)
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  }
)

export default api
