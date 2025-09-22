<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="title">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input
              v-model="form.username"
              class="input"
              type="text"
              placeholder="Your username"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              v-model="form.password"
              class="input"
              type="password"
              placeholder="Your password"
              required
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button
              :disabled="loading"
              class="button is-primary is-fullwidth"
              type="submit"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="notification is-danger is-light">
          {{ error }}
        </div>
      </form>

      <p class="has-text-centered">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
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
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.loginUser(form.value)
    router.push('/')
  } catch (err) {
    console.log(err)
    error.value = err.response?.data?.detail || 'Login failed. Please try again.'
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
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
}

.notification {
  margin-top: 1rem;
  padding: 1rem;
}
</style>