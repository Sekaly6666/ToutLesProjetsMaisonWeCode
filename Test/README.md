# 📇 MyContacts

Une application web premium et moderne pour la gestion de vos contacts, développée avec **Vue.js 3** et **Tailwind CSS v4**.

## 🎨 Design & Esthétique
L'application arbore un design haute fidélité basé sur une charte graphique **Noir, Blanc et Rouge**. L'accent a été mis sur la fluidité des transitions et une expérience utilisateur premium.

## 🚀 Fonctionnalités
- **Authentification Complète** : Système d'inscription et de connexion sécurisé via JWT.
- **Gestion des Contacts (CRUD)** :
  - Ajouter un nouveau contact (Nom, Email, Téléphone, Genre, Entreprise, etc.).
  - Consulter la liste complète des contacts.
  - Voir les détails détaillés d'un contact.
  - Modifier les informations d'un contact existant.
  - Supprimer un contact.
- **Recherche & Filtrage** :
  - Barre de recherche dynamique pour trouver un contact instantanément.
  - Filtrage entre "Mes Contacts" et "Tous les contacts".
- **Espace Profil** :
  - Modification des informations personnelles.
  - Changement de mot de passe sécurisé.
- **Localisation** : Interface entièrement traduite en **français**.

## 🛠️ Stack Technique
- **Frontend** : Vue.js 3 (Composition API)
- **Outil de Build** : Vite
- **Styling** : Tailwind CSS v4 & PostCSS
- **Gestion d'état** : Stores réactifs Vue
- **API** : Axios pour les requêtes vers l'API externe (https://api-contact.zoul.dev/api)

## 📦 Installation

1.  **Cloner le projet** :
    ```bash
    git clone <url-du-depot>
    ```
2.  **Installer les dépendances** :
    ```bash
    npm install
    ```
3.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```

## 📂 Structure du Projet
- `src/components/` : Composants UI réutilisables (Navbar, ContactCard).
- `src/views/` : Pages principales de l'application.
- `src/services/` : Configuration de l'instance Axios et traducteur d'erreurs.
- `src/store/` : Gestion de l'état global (authentification).
- `src/router/` : Configuration des routes et des gardes de sécurité.
- `src/style.css` : Styles globaux et configuration Tailwind.

## 📄 Licence
Projet réalisé dans le cadre d'un exercice de développement Web.
