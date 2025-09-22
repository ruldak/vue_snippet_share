<template>
  <div class="snippet-detail-view">
    <div v-if="loading" class="loading">Loading snippet...</div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <i class="fas fa-exclamation-triangle error-icon"></i>
        <h2>Unable to Load Snippet</h2>
        <p>{{ error }}</p>
        <router-link to="/snippets" class="button is-primary">
          Back to Snippets
        </router-link>
      </div>
    </div>

    <div v-else-if="snippet" class="snippet-container">
      <div class="snippet-header">
        <div class="header-content">
          <h1 class="snippet-title">{{ snippet.title }}</h1>
          <div class="snippet-meta">
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>Created by {{ snippet.user }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>{{ formatDate(snippet.created_at) }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-tag"></i>
              <span v-if="snippet.language == 'django'" class="tag" :class="languageClass(snippet.language)">
                {{ snippet.language }} template
              </span>
              <span v-else class="tag" :class="languageClass(snippet.language)">
                {{ snippet.language }}
              </span>
            </div>
            <div class="meta-item">
              <i class="fas fa-eye"></i>
              <span class="tag" :class="visibilityClass(snippet.visibility)">
                {{ snippet.visibility }}
              </span>
            </div>
            <div v-if="snippet.expires_at" class="meta-item">
              <i class="fas fa-clock"></i>
              <span>Expires {{ formatDate(snippet.expires_at) }}</span>
            </div>
            <div v-if="snippet.is_expired" class="meta-item">
              <span class="tag is-danger">Expired</span>
            </div>
          </div>
        </div>
        
        <div v-if="isOwner" class="snippet-actions">
          <router-link
            :to="`/snippets/${snippet.id}/edit`"
            class="button is-outlined is-primary"
          >
            <i class="fas fa-edit"></i>
            Edit
          </router-link>
          <button
            @click="deleteSnippet"
            class="button del-btn is-outlined is-danger"
            :class="{ 'is-loading': isDeleting }"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>
              <i class="fas fa-trash"></i>
              Delete
            </span>
          </button>
        </div>
      </div>

      <div class="code-section">
        <div class="code-header">
          <h3>Code</h3>
          <button
            @click="copyToClipboard"
            class="button is-small is-outlined"
            :class="{ 'is-success': copySuccess }"
          >
            <i class="fas" :class="copySuccess ? 'fa-check' : 'fa-copy'"></i>
            {{ copySuccess ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        
        <div class="code-container">
          <pre v-highlight="snippet.language"><code class="hljs">{{ snippet.content }}</code></pre>
        </div>
      </div>

      <div v-if="isOwner" class="analytics-section">
        <h3>Analytics</h3>
        <div v-if="analyticsLoading" class="loading">Loading analytics...</div>
        <div v-else class="analytics-content">
          <div class="analytics-grid">
            <div class="analytics-item">
              <div class="analytics-value">{{ analytics.total_views || 0 }}</div>
              <div class="analytics-label">Total Views</div>
            </div>
          </div>          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useSnippetStore } from '../store/snippet'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const snippetStore = useSnippetStore()

const snippet = ref(null)
const analytics = ref({})
const loading = ref(true)
const analyticsLoading = ref(false)
const error = ref('')
const copySuccess = ref(false)
const isDeleting = ref(false)

const isOwner = computed(() => {
  const user = JSON.parse(localStorage.getItem('user_profile'))
  return snippet.value && snippet.value.user === user?.username
})

const maxDailyViews = computed(() => {
  if (!analytics.value.daily_views) return 0
  return Math.max(...analytics.value.daily_views.map(day => day.views), 1)
})

onMounted(async () => {
  await fetchSnippet()
})

const fetchSnippet = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const snippetId = route.params.id
    snippet.value = await snippetStore.fetchSnippet(snippetId)
    
    if (isOwner.value) {
      await fetchAnalytics(snippetId)
    }
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to load snippet'
    console.error('Error fetching snippet:', err)
  } finally {
    loading.value = false
  }
}

const fetchAnalytics = async (snippetId) => {
  analyticsLoading.value = true
  try {
    const response = await snippetStore.fetchSnippetAnalytics(snippetId)
    analytics.value = response.data
  } catch (err) {
    console.error('Error fetching analytics:', err)
  } finally {
    analyticsLoading.value = false
  }
}

const deleteSnippet = async () => {
  if (!confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
    return
  }

  isDeleting.value = true
  try {
    await snippetStore.deleteSnippet(snippet.value.id)
    router.push('/snippets')
  } catch (err) {
    console.error('Error deleting snippet:', err)
    alert('Failed to delete snippet. Please try again.')
  } finally {
    isDeleting.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(snippet.value.content)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}

const languageClass = (language) => {
  return `is-${language}`
}

const visibilityClass = (visibility) => {
  return {
    'is-primary': visibility === 'public',
    'is-warning': visibility === 'private',
    'is-info': visibility === 'unlisted'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatChartDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.snippet-detail-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.error-content {
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 3rem;
  color: #ff3860;
  margin-bottom: 1rem;
}

.snippet-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  border-bottom: 1px solid #e5e5e5;
}

.header-content {
  flex: 1;
}

.snippet-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #363636;
}

.snippet-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.snippet-actions {
  display: flex;
  gap: 0.5rem;
}

.del-btn {
  color: #ff3860;
}

.del-btn:hover {
  color: white;
}

.code-section {
  padding: 2rem;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.code-container {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
}

pre {
  margin: 0;
  padding: 1rem;
  background: #f6f8fa;
  overflow-x: auto;
}

.analytics-section {
  padding: 2rem;
  border-top: 1px solid #e5e5e5;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.analytics-item {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.analytics-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3273dc;
  margin-bottom: 0.5rem;
}

.analytics-label {
  color: #666;
  font-size: 0.9rem;
}

.chart-container {
  margin-top: 2rem;
}

.chart {
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-bar {
  flex: 1;
  background: #3273dc;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  transition: height 0.3s;
}

.chart-bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  font-weight: bold;
  color: #363636;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.chart-label {
  flex: 1;
  text-align: center;
  font-size: 0.8rem;
  color: #666;
}

.empty-analytics {
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .snippet-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .snippet-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .snippet-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>