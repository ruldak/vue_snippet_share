<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">Snippet Share</router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Dashboard</router-link>
        <router-link to="/snippets" class="navbar-item">My Snippets</router-link>
        <router-link to="/explore" class="navbar-item">Explore</router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button v-if="isAuthenticated" @click="logout" class="button is-light">
              Logout
            </button>
            <template v-else>
              <router-link to="/register" class="button is-primary">
                <strong>Sign up</strong>
              </router-link>
              <router-link to="/login" class="button is-light">
                Log in
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e5e5e5;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.2rem;
}

.navbar-menu {
  display: flex;
}

.navbar-start {
  display: flex;
  gap: 1rem;
}

.navbar-end {
  display: flex;
}

.navbar-item {
  text-decoration: none;
  color: #363636;
  padding: 0.1rem 1rem;
  text-align: center;
}

.navbar-item:hover {
  background-color: #e5e5e5;
  border-radius: 4px;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}
</style>