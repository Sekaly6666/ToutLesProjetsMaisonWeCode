// faite par sekou amara bamba
// Ce fichier est le point d'entrée JavaScript/TypeScript de l'application. Il instancie l'application Vue, y associe Pinia (pour la gestion des états globaux) et Vue Router (pour la navigation), puis monte l'ensemble sur l'élément HTML '#app'.
// Toucher par SEKOU AMARA BAMBA
import { createApp } from 'vue'; // Toucher par SEKOU AMARA BAMBA
import { createPinia } from 'pinia'; // Toucher par SEKOU AMARA BAMBA
import App from './App.vue'; // Toucher par SEKOU AMARA BAMBA
import router from './router'; // Toucher par SEKOU AMARA BAMBA
import './style.css'; // Toucher par SEKOU AMARA BAMBA

const app = createApp(App); // Toucher par SEKOU AMARA BAMBA

app.use(createPinia()); // Toucher par SEKOU AMARA BAMBA
app.use(router); // Toucher par SEKOU AMARA BAMBA

app.mount('#app'); // Toucher par SEKOU AMARA BAMBA
// Toucher par SEKOU AMARA BAMBA

