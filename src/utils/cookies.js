import Cookies from 'js-cookie'

const TOKEN_KEY = 'jwt_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const getToken = () => {
  return Cookies.get(TOKEN_KEY)
}

export const setToken = (token, expires = 7) => {
  Cookies.set(TOKEN_KEY, token, { expires })
}

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export const setRefreshToken = (token, expires = 7) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { expires })
}