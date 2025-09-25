<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">Snippet Share</router-link>
      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': isMenuOpen }"
        @click="toggleMenu"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: relative; /* Add this */
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-burger {
  display: none;
  cursor: pointer;
}

.navbar-burger span {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px;
  background-color: #363636;
  transition: all 0.3s;
}

.navbar-menu {
  display: flex;
  width: 1500px;
  font-size: 1rem;
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

@media (max-width: 768px) {
  .navbar-burger {
    display: block;
  }

  .navbar-menu {
    z-index: 10; /* Add this */
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    background-color: #f5f5f5;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid #e5e5e5;
  }

  .navbar-menu.is-active {
    display: flex;
  }

  .navbar-start {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .navbar-end {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;
  }

  .buttons {
    flex-direction: column;
  }
}
</style>