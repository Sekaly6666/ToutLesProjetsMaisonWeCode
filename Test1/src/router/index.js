import { createRouter, createWebHistory } from 'vue-router'

import ContactCreateView from '@/views/ContactCreateView.vue'
import ContactDetailView from '@/views/ContactDetailView.vue'
import ContactEditView from '@/views/ContactEditView.vue'
import ContactsView from '@/views/ContactsView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProfileView from '@/views/ProfileView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UsersContactsView from '@/views/UsersContactsView.vue'
import { fetchCurrentUser } from '@/services/auth'
import { session } from '@/stores/session'
import { clearSession, saveSession } from '@/stores/session'

let validatedToken = null
let validationPromise = null

async function ensureValidSession() {
  const token = session.token

  if (!token) {
    validatedToken = null
    return false
  }

  if (validatedToken === token) {
    return true
  }

  if (!validationPromise) {
    validationPromise = fetchCurrentUser()
      .then((user) => {
        saveSession({
          user,
          token,
        })
        validatedToken = token
        return true
      })
      .catch(() => {
        clearSession()
        validatedToken = null
        return false
      })
      .finally(() => {
        validationPromise = null
      })
  }

  return validationPromise
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/contacts/new',
      name: 'contact-create',
      component: ContactCreateView,
      meta: { requiresAuth: true },
    },
    {
      path: '/contacts/:id',
      name: 'contact-detail',
      component: ContactDetailView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/contacts/:id/edit',
      name: 'contact-edit',
      component: ContactEditView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/:id/contacts',
      name: 'user-contacts',
      component: UsersContactsView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

router.beforeEach(async (to) => {
  const isAuthenticated = await ensureValidSession()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  return true
})

export default router
