<template>
  <div class="snippet-list">
    <div class="snippet-header">
      <h2 class="title">My Snippets</h2>
      <router-link to="/snippets/new" class="button is-primary">
        Create New Snippet
      </router-link>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="snippets.length === 0" class="empty-state">
      <p>You don't have any snippets yet.</p>
      <router-link to="/snippets/new" class="button is-primary">
        Create Your First Snippet
      </router-link>
    </div>

    <div v-else class="snippets">
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
          </div>
        </div>
        <div class="snippet-actions">
          <router-link
            :to="`/snippets/${snippet.id}/edit`"
            class="button is-small is-outlined"
          >
            Edit
          </router-link>
          <button
            @click="deleteSnippet(snippet.id)"
            class="button is-small is-danger is-outlined"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="button is-small"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="button is-small"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSnippetStore } from '../store/snippet'

const snippetStore = useSnippetStore()

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const snippets = computed(() => snippetStore.snippets)
const totalPages = computed(() => snippetStore.totalPages)

onMounted(() => {
  fetchSnippets()
})

watch(currentPage, (newPage) => {
  fetchSnippets(newPage)
})

const fetchSnippets = async (page = 1) => {
  loading.value = true
  try {
    await snippetStore.fetchSnippets({ page, page_size: pageSize.value })
    currentPage.value = page
  } catch (error) {
    console.error('Failed to fetch snippets:', error)
  } finally {
    loading.value = false
  }
}

const deleteSnippet = async (id) => {
  if (confirm('Are you sure you want to delete this snippet?')) {
    try {
      await snippetStore.deleteSnippet(id)
      // Refresh the list
      fetchSnippets(currentPage.value)
    } catch (error) {
      console.error('Failed to delete snippet:', error)
    }
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
.snippet-list {
  max-width: 800px;
  margin: 0 auto;
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.snippets {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.snippet-card {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}
</style>