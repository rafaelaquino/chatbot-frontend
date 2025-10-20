import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password })
      
      if (response.data.success) {
        token.value = response.data.token
        user.value = response.data.user
        
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return { success: true }
      }
      
      return { success: false, message: 'Login fallido' }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function checkAuth() {
    if (!token.value) return false
    
    try {
      const response = await api.get('/auth/me')
      if (response.data.success) {
        user.value = response.data.user
        return true
      }
      logout()
      return false
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})