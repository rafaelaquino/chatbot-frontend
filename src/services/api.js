import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Agregar token JWT
api.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  error => {
    console.error('Error en request:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Manejar errores globales
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status
      
      if (status === 401) {
        // Token inválido o expirado
        const authStore = useAuthStore()
        authStore.logout()
        router.push('/login')
      } else if (status === 403) {
        console.error('Acceso denegado')
      } else if (status === 500) {
        console.error('Error interno del servidor')
      }
    } else if (error.request) {
      // No hubo respuesta
      console.error('No hay respuesta del servidor')
    } else {
      // Error en la configuración
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api