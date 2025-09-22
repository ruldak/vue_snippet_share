<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="title">Dashboard</h1>
      <p class="subtitle">Welcome back, {{ user?.username }}!</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-code"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.total_snippets || 0 }}</h3>
          <p>Total Snippets</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-eye"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.total_views || 0 }}</h3>
          <p>Total Views</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-globe"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.public_snippets || 0 }}</h3>
          <p>Public Snippets</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-lock"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.private_snippets || 0 }}</h3>
          <p>Private Snippets</p>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <h2 class="section-title">Recent Snippets</h2>
      <div v-if="recentSnippetsLoading" class="loading">Loading...</div>
      <div v-else-if="recentSnippets.length === 0" class="empty-state">
        <p>You don't have any snippets yet.</p>
        <router-link to="/snippets/new" class="button is-primary">
          Create Your First Snippet
        </router-link>
      </div>
      <div v-else class="recent-snippets">
        <div v-for="snippet in recentSnippets" :key="snippet.id" class="snippet-card">
          <div class="snippet-content">
            <h3 class="snippet-title">
              <router-link :to="`/snippets/${snippet.id}`">
                {{ snippet.title }}
              </router-link>
            </h3>
            <p class="snippet-preview">{{ snippet.preview }}</p>
            <div class="snippet-meta">
              <span class="tag is-light">{{ snippet.language }}</span>
              <span class="tag" :class="visibilityClass(snippet.visibility)">
                {{ snippet.visibility }}
              </span>
              <span class="snippet-date">{{ formatDate(snippet.created_at) }}</span>
            </div>
          </div>
          <div class="snippet-actions">
            <router-link
              :to="`/snippets/${snippet.id}`"
              class="button is-small is-outlined"
            >
              View
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/snippets/new" class="action-card">
          <div class="action-icon">
            <i class="fas fa-plus"></i>
          </div>
          <h3>Create New Snippet</h3>
          <p>Create a new code snippet</p>
        </router-link>

        <router-link to="/snippets" class="action-card">
          <div class="action-icon">
            <i class="fas fa-list"></i>
          </div>
          <h3>View All Snippets</h3>
          <p>Browse all your snippets</p>
        </router-link>

        <div class="action-card" @click="fetchStats">
          <div class="action-icon">
            <i class="fas fa-sync-alt"></i>
          </div>
          <h3>Refresh Stats</h3>
          <p>Update your dashboard</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import { useSnippetStore } from '../store/snippet'
import api from '../services/api'

const authStore = useAuthStore()
const snippetStore = useSnippetStore()

const user = JSON.parse(localStorage.getItem('user_profile'))
const stats = ref({})
const recentSnippets = ref([])
const recentSnippetsLoading = ref(false)

onMounted(() => {
  fetchStats()
  fetchRecentSnippets()
})

const fetchStats = async () => {
  try {
    // In a real app, you would have an endpoint for user stats
    const response = await api.get('/snippets/')
    const snippets = response.data.results
    
    stats.value = {
      total_snippets: snippets.length,
      total_views: snippets.reduce((sum, snippet) => sum + (snippet.access_log_count || 0), 0),
      public_snippets: snippets.filter(s => s.visibility === 'public').length,
      private_snippets: snippets.filter(s => s.visibility === 'private').length
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

const fetchRecentSnippets = async () => {
  recentSnippetsLoading.value = true
  try {
    const response = await api.get('/snippets/', {
      params: {
        ordering: '-created_at',
        limit: 5
      }
    })
    recentSnippets.value = response.data.results
  } catch (error) {
    console.error('Failed to fetch recent snippets:', error)
  } finally {
    recentSnippetsLoading.value = false
  }
}

const visibilityClass = (visibility) => {
  return {
    'is-primary': visibility === 'public',
    'is-warning': visibility === 'private',
    'is-info': visibility === 'unlisted'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
  color: #3273dc;
}

.stat-content h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #363636;
}

.stat-content p {
  color: #666;
  margin: 0;
}

.recent-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #363636;
}

.recent-snippets {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.snippet-card {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.snippet-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.snippet-content {
  flex: 1;
}

.snippet-title {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.snippet-title a {
  color: #363636;
  text-decoration: none;
}

.snippet-title a:hover {
  color: #3273dc;
}

.snippet-preview {
  color: #666;
  margin-bottom: 1rem;
}

.snippet-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.snippet-date {
  color: #888;
  font-size: 0.9rem;
}

.snippet-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.quick-actions {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #3273dc;
}

.action-card h3 {
  margin-bottom: 0.5rem;
  color: #363636;
}

.action-card p {
  color: #666;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>