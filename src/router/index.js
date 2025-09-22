// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/snippets',
    name: 'Snippets',
    component: () => import('../views/SnippetView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/snippets/new',
    name: 'SnippetCreate',
    component: () => import('../views/SnippetFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/snippets/:id/edit',
    name: 'SnippetEdit',
    component: () => import('../views/SnippetFormView.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/snippets/:id',
    name: 'SnippetDetail',
    component: () => import('../views/SnippetDetailView.vue'),
    meta: { requiresAuth: false },
    props: true
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('../views/ExploreView.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router