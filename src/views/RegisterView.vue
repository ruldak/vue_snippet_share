<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="title">Create Account</h2>
      <form @submit.prevent="handleRegister">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input
              v-model="form.username"
              class="input"
              type="text"
              placeholder="Enter your username"
              required
              :class="{ 'is-danger': errors.username }"
            />
          </div>
          <p v-if="errors.username" class="help is-danger">{{ errors.username }}</p>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              v-model="form.email"
              class="input"
              type="email"
              placeholder="Enter your email (optional)"
              :class="{ 'is-danger': errors.email }"
            />
          </div>
          <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              v-model="form.password"
              class="input"
              type="password"
              placeholder="Enter your password"
              required
              :class="{ 'is-danger': errors.password }"
            />
          </div>
          <p v-if="errors.password" class="help is-danger">{{ errors.password }}</p>
        </div>

        <div class="field">
          <label class="label">Confirm Password</label>
          <div class="control">
            <input
              v-model="form.password2"
              class="input"
              type="password"
              placeholder="Confirm your password"
              required
              :class="{ 'is-danger': errors.password2 }"
            />
          </div>
          <p v-if="errors.password2" class="help is-danger">{{ errors.password2 }}</p>
        </div>

        <div class="field">
          <div class="control">
            <button
              :disabled="loading"
              class="button is-primary is-fullwidth"
              type="submit"
            >
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="notification is-danger is-light">
          {{ error }}
        </div>
      </form>

      <p class="has-text-centered">
        Already have an account?
        <router-link to="/login" class="has-text-primary">Sign in here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  password2: ''
})

const errors = ref({
  username: '',
  email: '',
  password: '',
  password2: ''
})

const loading = ref(false)
const error = ref('')

const validateForm = () => {
  let isValid = true
  errors.value = { username: '', email: '', password: '', password2: '' }

  if (form.value.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
    isValid = false
  }

  if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (form.value.password !== form.value.password2) {
    errors.value.password2 = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    await authStore.registerUser(form.value)
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
    
    // Handle specific field errors from API
    if (err.response?.data) {
      const data = err.response.data
      if (data.username) errors.value.username = data.username[0]
      if (data.email) errors.value.email = data.email[0]
      if (data.password) errors.value.password = data.password[0]
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #363636;
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #363636;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 2px rgba(50, 115, 220, 0.25);
}

.input.is-danger {
  border-color: #ff3860;
}

.help.is-danger {
  color: #ff3860;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.notification {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.has-text-centered {
  text-align: center;
  margin-top: 1.5rem;
}

.has-text-primary {
  color: #3273dc;
  text-decoration: none;
}

.has-text-primary:hover {
  text-decoration: underline;
}
</style>