# Étape 1 : Utilise une image Node officielle
FROM node:20

# Étape 2 : Définit le dossier de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copie les fichiers de projet
COPY package*.json ./

# Étape 4 : Installe les dépendances
RUN npm install

# Étape 5 : Copie tout le reste du code
COPY . .

# Étape 6 : Expose le port utilisé par Vite (si Vite, sinon 3000 ou autre)
EXPOSE 5173

# Étape 7 : Lance l’app en mode dev
CMD ["npm", "run", "dev"]
