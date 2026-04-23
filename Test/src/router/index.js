import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Connexion from '../views/Connexion.vue'
import Inscription from '../views/Inscription.vue'
import Profil from '../views/Profil.vue'
import DetailsContact from '../views/DetailsContact.vue'
import { useAuthStore } from '../store/authentification'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Accueil,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Connexion
  },
  {
    path: '/register',
    name: 'register',
    component: Inscription
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profil,
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts/new',
    name: 'contact-new',
    component: () => import('../views/FormulaireContact.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts/:id',
    name: 'contact-detail',
    component: DetailsContact,
    meta: { requiresAuth: true }
  },
  {
    path: '/contacts/:id/edit',
    name: 'contact-edit',
    component: () => import('../views/FormulaireContact.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
