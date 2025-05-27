# 🏎️ F1 Betting App - Frontend

Une application web de paris sur la Formule 1, construite avec React, TypeScript, Tailwind CSS et Apollo Client pour interagir avec un backend GraphQL.

## 🚀 Fonctionnalités principales

- Authentification avec JWT (connexion / création de compte)
- Page d’accueil affichant les prochaines courses de F1
- Interface de paris : prédictions P10 & premier DNF
- Gestion des ligues (création, adhésion, consultation)
- Connexion au backend GraphQL via Apollo Client
- Design moderne, responsive, inspiré de l’univers F1

## 🧰 Technologies utilisées

- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [React Router DOM](https://reactrouter.com/)
- Authentification avec [JWT](https://jwt.io/)

## 📁 Structure du projet

```
src/
├── components/     # Composants réutilisables (UI, Layout, RaceCard, etc.)
├── contexts/       # Contexte d’authentification (AuthContext)
├── graphql/        # Requêtes et mutations GraphQL
├── pages/          # Pages principales : Login, Signup, Home, etc.
├── types/          # Déclarations de types TypeScript
├── utils/          # Fonctions utilitaires
├── App.tsx         # Définition des routes de l’application
├── main.tsx        # Point d’entrée principal + ApolloProvider
└── index.html      # Fichier HTML de base
```

## 🔧 Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/ton-pseudo/f1-betting-app-frontend.git
cd f1-betting-app-frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l’environnement

Créer un fichier `.env` à la racine du projet avec la variable suivante :

```ini
VITE_GRAPHQL_API_URL=https://ton-backend/graphql
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible à l'adresse : [http://localhost:5173](http://localhost:5173)
