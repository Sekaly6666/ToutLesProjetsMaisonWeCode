// faite par sekou amara bamba
// Ce fichier configure le routeur Vue (vue-router). Il définit les différentes routes (chemins) de l'application (Accueil, Détail, Édition) et les associe à leurs vues correspondantes.
import { createRouter, createWebHistory } from 'vue-router'; // Toucher par SEKOU AMARA BAMBA
import ListView from '@/views/ListView.vue'; // Toucher par SEKOU AMARA BAMBA
import DetailView from '@/views/DetailView.vue'; // Toucher par SEKOU AMARA BAMBA
import EditView from '@/views/EditView.vue'; // Toucher par SEKOU AMARA BAMBA

const routes = [ // Toucher par SEKOU AMARA BAMBA
  { // Toucher par SEKOU AMARA BAMBA
    path: '/', // Toucher par SEKOU AMARA BAMBA
    name: 'home', // Toucher par SEKOU AMARA BAMBA
    component: ListView // Toucher par SEKOU AMARA BAMBA
  }, // Toucher par SEKOU AMARA BAMBA
  { // Toucher par SEKOU AMARA BAMBA
    path: '/note/:id', // Toucher par SEKOU AMARA BAMBA
    name: 'detail', // Toucher par SEKOU AMARA BAMBA
    component: DetailView // Toucher par SEKOU AMARA BAMBA
  }, // Toucher par SEKOU AMARA BAMBA
  { // Toucher par SEKOU AMARA BAMBA
    path: '/edit/:id?', // Toucher par SEKOU AMARA BAMBA
    name: 'edit', // Toucher par SEKOU AMARA BAMBA
    component: EditView // Toucher par SEKOU AMARA BAMBA
  } // Toucher par SEKOU AMARA BAMBA
]; // Toucher par SEKOU AMARA BAMBA

const router = createRouter({ // Toucher par SEKOU AMARA BAMBA
  history: createWebHistory(), // Toucher par SEKOU AMARA BAMBA
  routes // Toucher par SEKOU AMARA BAMBA
}); // Toucher par SEKOU AMARA BAMBA

export default router; // Toucher par SEKOU AMARA BAMBA
