# MyContacts

MyContacts est une application Vue 3 pour gérer une liste de contacts avec authentification, recherche, consultation détaillée et CRUD complet.

## Fonctionnalités

- Création de compte
- Connexion et déconnexion
- Affichage des contacts de l’utilisateur connecté
- Création, modification, suppression et consultation d’un contact
- Recherche dans la liste
- Vue bêta pour consulter les contacts d’un autre utilisateur
- Interface en blanc, noir et rouge

## Stack

- Vue.js 3
- Vue Router
- Vite
- Bootstrap
- API distante JSON Server: `https://api-contact.zoul.dev/api`

## Lancer le projet

1. Installer les dépendances:

```bash
npm install
```

2. Démarrer le serveur de développement:

```bash
npm run dev
```

3. Générer le build de production:

```bash
npm run build
```

## Configuration

Si vous voulez utiliser une autre API, créez un fichier `.env` à la racine du projet:

```bash
VITE_API_BASE_URL=https://api-contact.zoul.dev/api
```

## Authentification

- L’inscription envoie `name`, `email`, `password` et `confirm_password`.
- La connexion récupère un jeton JWT qui est stocké localement.
- Les requêtes protégées ajoutent automatiquement le header `Authorization: Bearer ...`.
- Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial.

## Notes

- Le projet utilise un script `postinstall` pour appliquer un shim local à `esbuild` sur Windows.
- Cela évite le blocage `spawn EPERM` rencontré dans cet environnement précis.
