import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useSnippetStore = defineStore('snippet', () => {
  const snippets = ref([])
  const searchResult = ref([])
  const currentSnippet = ref(null)
  const totalPages = ref(1)
  const currentPage = ref(1)

  const searchSnippets = async (params = {}) => {
    try {
      const response = await api.get('/search/', { params })
      searchResult.value = response.data.results
      totalPages.value = Math.ceil(response.data.count / 10)
      return response.data
    } catch (error) {
      console.error('Error fetching snippets:', error)
      throw error
    }
  }

  const fetchSnippets = async (params = {}) => {
    try {
      const response = await api.get('/snippets/', { params })
      snippets.value = response.data.results
      totalPages.value = Math.ceil(response.data.count / 10)
      return response.data
    } catch (error) {
      console.error('Error fetching snippets:', error)
      throw error
    }
  }

  const fetchSnippet = async (id) => {
    try {
      const response = await api.get(`/snippet/detail/${id}/`)
      currentSnippet.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching snippet:', error)
      throw error
    }
  }

  const createSnippet = async (snippetData) => {
    try {
      const response = await api.post('/snippets/', snippetData)
      snippets.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating snippet:', error)
      throw error
    }
  }

  const updateSnippet = async (id, snippetData) => {
    try {
      const response = await api.put(`/snippets/${id}/`, snippetData)
      const index = snippets.value.findIndex(s => s.id === id)
      if (index !== -1) {
        snippets.value[index] = response.data
      }
      currentSnippet.value = response.data
      return response.data
    } catch (error) {
      console.error('Error updating snippet:', error)
      throw error
    }
  }

  const deleteSnippet = async (id) => {
    try {
      await api.delete(`/snippets/${id}/`)
      snippets.value = snippets.value.filter(s => s.id !== id)
    } catch (error) {
      console.error('Error deleting snippet:', error)
      throw error
    }
  }

  const fetchSnippetAnalytics = async (id) => {
    try {
      const response = await api.get(`/snippets/${id}/analytics/`)
      return response
    } catch (error) {
      console.error('Error fetching snippet analytics:', error)
      throw error
    }
  }

  return {
    snippets,
    searchResult,
    currentSnippet,
    totalPages,
    currentPage,
    fetchSnippets,
    fetchSnippet,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    fetchSnippetAnalytics
  }
})