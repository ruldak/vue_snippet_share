import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken } from '../utils/cookies'
import { login, register, getProfile } from '../services/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())

  const isAuthenticated = computed(() => !!token.value)

  const setUser = (userData) => {
    localStorage.setItem('user_profile', JSON.stringify(userData))
  }

  const setAuthToken = (newToken) => {
    token.value = newToken
    setToken(newToken)
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('user_profile')
    removeToken()
  }

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials)
      setAuthToken(response.data.access)
      const profile = await getProfile()
      setUser(profile.data)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const registerUser = async (userData) => {
    try {
      const response = await register(userData)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const fetchProfile = async () => {
    try {
      if (isAuthenticated.value) {
        const response = await getProfile()
        setUser(response.data)
        return Promise.resolve(response)
      }
    } catch (error) {
      logout()
      return Promise.reject(error)
    }
  }

  return {
    token,
    isAuthenticated,
    setUser,
    setAuthToken,
    logout,
    loginUser,
    registerUser,
    fetchProfile
  }
})