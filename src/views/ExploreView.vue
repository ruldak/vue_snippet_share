<template>
  <div class="explore-view">
    <div class="explore-header">
      <h1 class="title">Explore Snippets</h1>
      <p class="subtitle">Discover code snippets from our community</p>
    </div>

    <div class="filters-section">
      <div class="filters-grid">
        <div class="filter-group">
          <label class="filter-label">Language</label>
          <div class="select">
            <select v-model="filters.language" @change="applyFilters">
              <option value="">All Languages</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="php">PHP</option>
              <option value="elixir">Elixir</option>
              <option value="django">Django Template</option>
              <option value="plaintext">Plain Text</option>
            </select>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Sort By</label>
          <div class="select">
            <select v-model="filters.ordering" @change="applyFilters">
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="-title">Title (Z-A)</option>
              <option value="-access_log_count">Most Viewed</option>
              <option value="access_log_count">Least Viewed</option>
            </select>
          </div>
        </div>

        <div class="filter-group search">
          <label class="filter-label">Search</label>
          <div class="search-box">
            <input
              v-model="filters.q"
              type="text"
              placeholder="Search snippets..."
            />
		  </div>
		  <button @click="applyFilters()" class="button is-primary" style="margin-top: 0.5rem;">Search</button>
		</div>

      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading snippets...</p>
    </div>

    <div v-else-if="snippets.length === 0" class="empty-state">
		<svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" role="img" aria-hidden="true" focusable="false" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
		  <circle cx="7" cy="7" r="4"></circle>
		  <line x1="11.5" y1="11.5" x2="15" y2="15"></line>
		</svg>
      <h3>No snippets found</h3>
      <p>Try adjusting your filters or search query</p>
    </div>

    <div v-else class="snippets-grid">
      <div v-for="snippet in snippets" :key="snippet.id" class="snippet-card">
        <div class="snippet-header">
          <h3 class="snippet-title">
            <router-link :to="`/snippets/${snippet.id}`">
              {{ snippet.title }}
            </router-link>
          </h3>
          <span class="user-badge">
            <i class="fas fa-user"></i>
            {{ snippet.user }}
          </span>
        </div>

        <div class="snippet-preview">
          <pre v-highlight="snippet.language"><code class="hljs">{{ snippet.preview }}</code></pre>
        </div>

        <div class="snippet-footer">
          <div class="snippet-meta">
            <span class="tag" :class="`lang-${snippet.language}`">
              {{ snippet.language }}
            </span>
            <span class="views-count">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 40" width="34" height="10" role="img" aria-labelledby="eye1Title">
				  <title id="eye1Title">Eye (outline)</title>
				  <path d="M2 20c8-10 20-16 30-16s22 6 30 16c-8 10-20 16-30 16S10 30 2 20z" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
				  <circle cx="32" cy="20" r="6" fill="currentColor"/>
				</svg>
              {{ snippet.access_log_count || 0 }}
            </span>
            <span class="date">
              {{ formatRelativeTime(snippet.created_at) }}
            </span>
          </div>
          <router-link
            :to="`/snippets/${snippet.id}`"
            class="view-button"
          >
            View More
          </router-link>
        </div>
      </div>
    </div>

        <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="filters.page === 1"
        @click="changePage(filters.page - 1)"
        class="pagination-button"
      >
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      
      <div class="pagination-pages">
        <span class="pagination-info">
          Page {{ filters.page }} of {{ totalPages }}
        </span>
      </div>
      
      <button
        :disabled="filters.page === totalPages"
        @click="changePage(filters.page + 1)"
        class="pagination-button"
      >
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

// Filters - this ref is now synced with the URL query
const filters = ref({
  language: '',
  ordering: '-created_at',
  q: '',
  page: 1
})

// Data
const snippets = ref([])
const loading = ref(false)
const totalPages = ref(1)
const totalCount = ref(0)

// Helper to keep the local UI state (filters ref) in sync with the URL
const updateFiltersFromRoute = () => {
    const query = route.query
    filters.value.language = query.language || ''
    filters.value.ordering = query.ordering || '-created_at'
    filters.value.q = query.q || ''
    filters.value.page = parseInt(query.page || '1')
}

// The main data fetching function
const fetchPublicSnippets = async (query) => {
  loading.value = true
  try {
    const params = {
      page_size: 10,
      visibility: 'public',
      ...query
    }

    const response = await api.get('/search/', { params })
    snippets.value = response.data.results
    totalCount.value = response.data.count
    totalPages.value = Math.ceil(response.data.count / params.page_size)

  } catch (error) {
    console.error('Failed to fetch public snippets:', error)
  } finally {
    loading.value = false
  }
}

// UI action to apply filters - its only job is to update the URL
const applyFilters = () => {
  // Reset to page 1 when filters change
  const query = { ...filters.value, page: 1 };

  // Clean up empty values
  Object.keys(query).forEach(key => {
    if (!query[key]) {
      delete query[key]
    }
  })

  router.push({ query });
}

// UI action for pagination
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  window.scrollTo(0, 0)
  const query = { ...route.query, page };
  router.push({ query });
}

// This watcher is the main trigger. It runs when the component loads and anytime the URL query changes.
watch(() => route.query,
  (newQuery) => {
    updateFiltersFromRoute() // Update UI controls to match URL
    fetchPublicSnippets(newQuery) // Fetch data based on new URL
  },
  { immediate: true } // This makes it run on initial load
)

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} d ago`
  }
  
  return date.toLocaleDateString()
}
</script>

<style scoped>
.explore-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.explore-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #363636;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #363636;
}

.select select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  background-color: white;
}

.search-box {
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3273dc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #363636;
}

.empty-state p {
  color: #666;
}

.snippets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.snippet-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.snippet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.snippet-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.snippet-title {
  margin: 0;
  font-size: 1.2rem;
  flex: 1;
}

.snippet-title a {
  color: #363636;
  text-decoration: none;
}

.snippet-title a:hover {
  color: #3273dc;
}

.user-badge {
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.snippet-preview {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  flex: 1;
}

.snippet-preview pre {
  margin: 0;
  overflow: hidden;
}

.snippet-preview code {
  font-size: 0.9rem;
  line-height: 1.4;
}

.snippet-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.snippet-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.lang-python { background: #3572A5; color: white; }
.lang-javascript { background: #f1e05a; color: #333; }
.lang-java { background: #b07219; color: white; }
.lang-cpp { background: #f34b7d; color: white; }
.lang-html { background: #e34c26; color: white; }
.lang-css { background: #563d7c; color: white; }
.lang-elixir { color: #5b0391; }
.lang-php { color: #777BB3; }
.lang-django { color: #092E20; }
.lang-plaintext { background: #f5f5f5; color: #333; }

.views-count, .date {
  font-size: 0.8rem;
  color: #666;
  display: flex;
  align-items: center;
}

.views-count::after {
  content: "•"; /* bisa diganti "|" atau simbol lain */
  margin: 0 0.5rem;
  color: #999;
}

.view-button {
  padding: 0.5rem 1rem;
  background: #3273dc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.view-button:hover {
  background: #2765c8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #dbdbdb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  color: #666;
}

.stats-bar {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .explore-view {
    padding: 1rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .snippets-grid {
    grid-template-columns: 1fr;
  }
  
  .snippet-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>