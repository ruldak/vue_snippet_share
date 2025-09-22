<template>
  <div class="snippet-form">
    <h2 class="title">{{ isEdit ? 'Edit Snippet' : 'Create Snippet' }}</h2>

    <form @submit.prevent="submitForm">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-model="form.title"
            class="input"
            type="text"
            placeholder="Snippet title"
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Content</label>
        <div class="control">
          <textarea
            v-model="form.content"
            class="textarea"
            placeholder="Paste your code here..."
            rows="10"
            required
          ></textarea>
        </div>
      </div>

      <div class="field">
        <label class="label">Language</label>
        <div class="control">
          <div class="select">
            <select v-model="form.language" required>
              <option value="plaintext">Plain Text</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Visibility</label>
        <div class="control">
          <div class="select">
            <select v-model="form.visibility" required>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
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
      </div>

      <div class="field">
        <div class="control">
          <button
            :disabled="loading"
            class="button is-primary"
            type="submit"
          >
            {{ loading ? 'Saving...' : 'Save Snippet' }}
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
    form.value = { ...snippet }
  } catch (err) {
    error.value = 'Failed to load snippet'
    console.error(err)
  }
}

const submitForm = async () => {
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
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.snippet-form {
  max-width: 800px;
  margin: 0 auto;
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.input,
.textarea,
.select select {
  width: 100%;
}

.textarea {
  font-family: monospace;
}

.control {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.notification {
  margin-top: 1rem;
}
</style>