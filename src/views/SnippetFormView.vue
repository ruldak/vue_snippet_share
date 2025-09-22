<template>
  <div class="snippet-form-view">
    <div class="form-container">
      <h1 class="title">{{ isEdit ? 'Edit Snippet' : 'Create New Snippet' }}</h1>
      
      <form @submit.prevent="submitForm">
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input
              v-model="form.title"
              class="input"
              type="text"
              placeholder="Enter a title for your snippet"
              required
              :class="{ 'is-danger': errors.title }"
            />
          </div>
          <p v-if="errors.title" class="help is-danger">{{ errors.title }}</p>
        </div>

        <div class="field">
          <label class="label">Content</label>
          <div class="control">
            <textarea
              v-model="form.content"
              class="textarea"
              placeholder="Paste your code here..."
              rows="12"
              required
              :class="{ 'is-danger': errors.content }"
            ></textarea>
          </div>
          <p v-if="errors.content" class="help is-danger">{{ errors.content }}</p>
        </div>

        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Language</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="form.language" required>
                    <option value="plaintext">Plain Text</option>
                    <option value="python">Python</option>
                    <option value="django">Django Template</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="elixir">Elixir</option>
                    <option value="php">PHP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div class="column">
            <div class="field">
              <label class="label">Visibility</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="form.visibility" required>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Expiration (Optional)</label>
          <div class="control">
            <input
              v-model="form.expires_at"
              class="input"
              type="datetime-local"
            />
          </div>
          <p class="help">
            Leave empty if you don't want this snippet to expire
          </p>
        </div>

        <div class="field">
          <div class="control">
            <button
              :disabled="loading"
              class="button is-primary is-medium"
              type="submit"
            >
              <i class="fas" :class="loading ? 'fa-spinner fa-spin' : isEdit ? 'fa-save' : 'fa-plus'"></i>
              {{ loading ? 'Saving...' : isEdit ? 'Update Snippet' : 'Create Snippet' }}
            </button>
            <router-link to="/snippets" class="button is-text">
              Cancel
            </router-link>
          </div>
        </div>

        <div v-if="error" class="notification is-danger is-light">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSnippetStore } from '../store/snippet'

const route = useRoute()
const router = useRouter()
const snippetStore = useSnippetStore()

const isEdit = computed(() => route.name === 'SnippetEdit')
const snippetId = computed(() => route.params.id)

const form = ref({
  title: '',
  content: '',
  language: 'plaintext',
  visibility: 'public',
  expires_at: null
})

const errors = ref({})
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (isEdit.value) {
    await fetchSnippet()
  }
})

const fetchSnippet = async () => {
  try {
    const snippet = await snippetStore.fetchSnippet(snippetId.value)
    form.value = {
      title: snippet.title,
      content: snippet.content,
      language: snippet.language,
      visibility: snippet.visibility,
      expires_at: snippet.expires_at ? snippet.expires_at.slice(0, 16) : null
    }
  } catch (err) {
    error.value = 'Failed to load snippet'
    console.error('Error fetching snippet:', err)
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (form.value.title.trim().length < 1) {
    errors.value.title = 'Title is required'
    isValid = false
  }

  if (form.value.content.trim().length < 1) {
    errors.value.content = 'Content is required'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    if (isEdit.value) {
      await snippetStore.updateSnippet(snippetId.value, form.value)
    } else {
      await snippetStore.createSnippet(form.value)
    }
    router.push('/snippets')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save snippet'
    
    // Handle field errors from API
    if (err.response?.data) {
      const data = err.response.data
      if (data.title) errors.value.title = data.title[0]
      if (data.content) errors.value.content = data.content[0]
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.snippet-form-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  margin-bottom: 2rem;
  color: #363636;
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #363636;
}

.input,
.textarea,
.select select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus,
.textarea:focus,
.select select:focus {
  outline: none;
  border-color: #3273dc;
  box-shadow: 0 0 0 2px rgba(50, 115, 220, 0.25);
}

.textarea {
  font-family: monospace;
  line-height: 1.5;
}

.input.is-danger,
.textarea.is-danger {
  border-color: #ff3860;
}

.help {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.help.is-danger {
  color: #ff3860;
}

.columns {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}

.column {
  padding: 0.75rem;
}

.notification {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.button {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .snippet-form-view {
    padding: 1rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .columns {
    flex-direction: column;
  }
}
</style>