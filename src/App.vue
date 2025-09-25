<template>
  <div id="app">
    <NavigationBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import NavigationBar from './components/NavigationBar.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Check if user is authenticated on app load
  if (authStore.isAuthenticated) {
    // authStore.fetchProfile()
  }
})
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #363636;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.main-content {
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}

.button {
  padding: 0.5rem 1rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  transition: all 0.2s;
}

.button:hover {
  background-color: #f5f5f5;
}

.button.is-primary {
  background-color: #3273dc;
  color: white;
  border-color: #3273dc;
}

.button.is-primary:hover {
  background-color: #2765c8;
}

.button.is-danger {
  background-color: #ff3860;
  color: white;
  border-color: #ff3860;
}

.button.is-danger:hover {
  background-color: #e62a52;
}

.button.is-light {
  background-color: #f5f5f5;
  color: #363636;
}

.button.is-outlined {
  background-color: transparent;
}

.button.is-outlined.is-primary {
  color: #3273dc;
  border-color: #3273dc;
}

.button.is-outlined.is-primary:hover {
  background-color: #3273dc;
  color: white;
}

.button.is-text {
  background-color: transparent;
  border-color: transparent;
  color: #363636;
}

.button.is-text:hover {
  background-color: #f5f5f5;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tag.is-light {
  background-color: #f5f5f5;
  color: #363636;
}

.tag.is-primary {
  background-color: #3273dc;
  color: white;
}

.tag.is-warning {
  background-color: #ffdd57;
  color: rgba(0, 0, 0, 0.7);
}

.tag.is-info {
  background-color: #209cee;
  color: white;
}

.tag.is-danger {
  background-color: #ff3860;
  color: white;
}

.notification {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.notification.is-danger {
  background-color: #ff3860;
  color: white;
}

.notification.is-danger.is-light {
  background-color: #feecf0;
  color: #cc0f35;
}

.input, .textarea, .select select {
  padding: 0.5rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 1rem;
}

.input:focus, .textarea:focus, .select select:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 2px rgba(50, 115, 220, 0.25);
}

.select {
  position: relative;
}

.select select {
  appearance: none;
  padding-right: 2.5rem;
}
</style>