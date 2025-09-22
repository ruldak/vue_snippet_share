import api from './api'

export const login = (credentials) => {
  return api.post('/token/', credentials)
}

export const register = (userData) => {
  return api.post('/register/', userData)
}

export const getProfile = () => {
  return api.get('/profile/')
}

export const refreshToken = (refresh) => {
  return api.post('/token/refresh/', { refresh })
}