<template>
  <div class="snippets-view">
    <div class="view-header">
      <h1 class="title">My Snippets</h1>
      <router-link to="/snippets/new" class="button is-primary">
        <i class="fas fa-plus"></i>
        New Snippet
      </router-link>
    </div>

    <div class="filters">
      <div class="field">
        <label class="label">Filter by Language</label>
        <div class="control">
          <div class="select">
            <select v-model="filters.language">
              <option value="">All Languages</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="php">PHP</option>
              <option value="elixir">Elixir</option>
              <option value="django">Django</option>
              <option value="plaintext">Plain Text</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Filter by Visibility</label>
        <div class="control">
          <div class="select">
            <select v-model="filters.visibility">
              <option value="">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Sort By</label>
        <div class="control">
          <div class="select">
            <select v-model="filters.ordering">
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="-title">Title (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

    </div>

    <div v-if="loading" class="loading">Loading snippets...</div>

    <div v-else-if="snippets.length === 0" class="empty-state">
      <div class="empty-content">
        <i class="fas fa-code empty-icon"></i>
        <h2>No snippets found</h2>
        <p v-if="hasActiveFilters">Try adjusting your filters or search query</p>
        <p v-else>You haven't created any snippets yet</p>
        <router-link to="/snippets/new" class="button is-primary">
          Create Your First Snippet
        </router-link>
      </div>
    </div>

    <div v-else class="snippets-list">
      <div v-for="snippet in snippets" :key="snippet.id" class="snippet-card">
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
            <span v-if="snippet.is_expired" class="tag is-danger">Expired</span>
          </div>
        </div>
        <div class="snippet-actions">
          <router-link
            :to="`/snippets/${snippet.id}`"
            class="button is-small is-outlined"
          >
            View
          </router-link>
          <router-link
            :to="`/snippets/${snippet.id}/edit`"
            class="button is-small is-outlined is-primary"
          >
            Edit
          </router-link>
          <button
            @click="deleteSnippet(snippet.id)"
            class="button del-btn is-small is-outlined is-danger"
            :class="{ 'is-loading': isDeleting[snippet.id] }"
            :disabled="isDeleting[snippet.id]"
          >
            <span v-if="isDeleting[snippet.id]">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="button"
      >
        Previous
      </button>
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue'
import { useSnippetStore } from '../store/snippet'

const snippetStore = useSnippetStore()

const filters = reactive({
  language: '',
  visibility: '',
  ordering: '-created_at',
})

const loading = ref(false)
const currentPage = ref(1)
const isDeleting = ref({})

const snippets = computed(() => snippetStore.snippets)
const totalPages = computed(() => snippetStore.totalPages)

const hasActiveFilters = computed(() => {
  return filters.language || filters.visibility || filters.search
})

onMounted(() => {
  fetchSnippets()
})

// Watch filters for changes
watch(filters, () => {
  currentPage.value = 1
  fetchSnippets()
})

watch(currentPage, (newPage) => {
  fetchSnippets(newPage)
})

const fetchSnippets = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      ...filters
    }
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') {
        delete params[key]
      }
    })
    
    await snippetStore.fetchSnippets(params)
    currentPage.value = page
  } catch (error) {
    console.error('Failed to fetch snippets:', error)
  } finally {
    loading.value = false
  }
}

const deleteSnippet = async (id) => {
  if (!confirm('Are you sure you want to delete this snippet?')) {
    return
  }

  isDeleting.value[id] = true
  try {
    await snippetStore.deleteSnippet(id)
    // Refresh the list
    fetchSnippets(currentPage.value)
  } catch (error) {
    console.error('Failed to delete snippet:', error)
    alert('Failed to delete snippet. Please try again.')
  } finally {
    isDeleting.value[id] = false
  }
}

const changePage = (page) => {
  currentPage.value = page
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
.snippets-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  color: #363636;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #363636;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-content {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-content h2 {
  margin-bottom: 0.5rem;
  color: #363636;
}

.empty-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.snippets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.del-btn {
  color: #ff3860;
}

.del-btn:hover {
  color: white;
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
  font-family: monospace;
  white-space: pre-wrap;
}

.snippet-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  color: #666;
}

@media (max-width: 768px) {
  .snippets-view {
    padding: 1rem;
  }
  
  .view-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .filters {
    grid-template-columns: 1fr;
  }
  
  .snippet-card {
    flex-direction: column;
    gap: 1rem;
  }
  
  .snippet-actions {
    justify-content: flex-end;
  }
  
  .snippet-preview {
	overflow: auto;
  }
}
</style>