<template>
  <div class="snippet-detail">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="snippet" class="snippet-container">
      <div class="snippet-header">
        <h2 class="title">{{ snippet.title }}</h2>
        <div class="snippet-actions">
          <router-link
            v-if="isOwner"
            :to="`/snippets/${snippet.id}/edit`"
            class="button is-small is-outlined"
          >
            Edit
          </router-link>
          <button
            v-if="isOwner"
            @click="deleteSnippet"
            class="button is-small is-danger is-outlined"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="snippet-meta">
        <span class="tag is-light">{{ snippet.language }}</span>
        <span class="tag" :class="visibilityClass(snippet.visibility)">
          {{ snippet.visibility }}
        </span>
        <span class="meta-item">Created by {{ snippet.user.username }}</span>
        <span class="meta-item">on {{ formatDate(snippet.created_at) }}</span>
        <span v-if="snippet.expires_at" class="meta-item">
          Expires on {{ formatDate(snippet.expires_at) }}
        </span>
        <span v-if="snippet.is_expired" class="tag is-danger">Expired</span>
      </div>

      <div class="code-container">
        <pre><code v-highlight="snippet.language" class="hljs">{{ snippet.content }}</code></pre>
      </div>

      <div class="snippet-analytics" v-if="isOwner">
        <h3 class="subtitle">Analytics</h3>
        <div class="analytics-data">
          <div class="analytics-item">
            <span class="analytics-label">Total Views:</span>
            <span class="analytics-value">{{ analytics.total_views || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error">
      Snippet not found
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import { useSnippetStore } from '../store/snippet'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const snippetStore = useSnippetStore()

const loading = ref(false)
const snippet = ref(null)
const analytics = ref({})

const isOwner = computed(() => {
  return snippet.value && authStore.user && snippet.value.user.id === authStore.user.id
})

onMounted(async () => {
  await fetchSnippet()
})

const fetchSnippet = async () => {
  loading.value = true
  try {
    const snippetId = route.params.id
    snippet.value = await snippetStore.fetchSnippet(snippetId)
    
    if (isOwner.value) {
      await fetchAnalytics(snippetId)
    }
  } catch (error) {
    console.error('Failed to fetch snippet:', error)
  } finally {
    loading.value = false
  }
}

const fetchAnalytics = async (snippetId) => {
  try {
    const response = await snippetStore.fetchSnippetAnalytics(snippetId)
    analytics.value = response.data
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
  }
}

const deleteSnippet = async () => {
  if (confirm('Are you sure you want to delete this snippet?')) {
    try {
      await snippetStore.deleteSnippet(snippet.value.id)
      router.push('/snippets')
    } catch (error) {
      console.error('Failed to delete snippet:', error)
    }
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
.snippet-detail {
  max-width: 900px;
  margin: 0 auto;
}

.snippet-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.snippet-actions {
  display: flex;
  gap: 0.5rem;
}

.snippet-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  color: #666;
  font-size: 0.9rem;
}

.code-container {
  margin: 1.5rem 0;
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

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.snippet-analytics {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e4e8;
}

.analytics-data {
  display: flex;
  gap: 2rem;
}

.analytics-item {
  display: flex;
  flex-direction: column;
}

.analytics-label {
  font-size: 0.9rem;
  color: #666;
}

.analytics-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}
</style>