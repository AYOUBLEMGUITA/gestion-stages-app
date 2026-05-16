# StageFlow - Application Web de Gestion des Stages

StageFlow est une application web full stack permettant de digitaliser la gestion des stages et des stagiaires au sein d’un établissement de formation.

Elle facilite la gestion des offres de stage, des candidatures, des documents administratifs, des conventions, des rapports, du suivi pédagogique, des évaluations, des notifications et de la communication entre les différents acteurs.

---

## Objectif du projet

L’objectif principal de ce projet est de proposer une plateforme centralisée permettant de :

- gérer les stagiaires ;
- gérer les entreprises partenaires ;
- publier et consulter les offres de stage ;
- permettre aux stagiaires de postuler en ligne ;
- suivre l’état des candidatures ;
- centraliser les documents administratifs ;
- gérer les conventions de stage ;
- déposer et valider les rapports ;
- assurer le suivi pédagogique des stagiaires ;
- gérer les évaluations ;
- afficher des statistiques et rapports ;
- faciliter la communication via messagerie interne ;
- proposer un assistant intelligent de support.

---

## Acteurs principaux

L’application contient quatre rôles principaux :

### Stagiaire
- gestion du profil ;
- consultation des offres ;
- candidature en ligne ;
- dépôt des documents ;
- suivi des candidatures ;
- dépôt des rapports ;
- demande de convention ;
- consultation des notifications ;
- messagerie interne ;
- assistant IA.

### Entreprise
- gestion du profil entreprise ;
- publication des offres de stage ;
- gestion des candidatures reçues ;
- acceptation ou refus des candidats ;
- évaluation des stagiaires ;
- messagerie interne.

### Formateur
- suivi des stagiaires ;
- ajout de remarques ;
- consultation des rapports ;
- validation des évaluations ;
- calendrier de suivi ;
- messagerie interne.

### Administrateur
- gestion des utilisateurs ;
- validation des documents ;
- gestion des conventions ;
- consultation des offres ;
- suivi global des stagiaires ;
- validation des rapports ;
- statistiques et export CSV ;
- messagerie interne.

---

## Fonctionnalités principales

- Authentification JWT
- Gestion des rôles
- Tableau de bord personnalisé par rôle
- CRUD profils stagiaire et entreprise
- CRUD offres de stage
- Système de candidatures
- Upload et validation des documents
- Gestion des rapports de stage
- Gestion des conventions
- Système d’évaluation
- Suivi pédagogique des stagiaires
- Notifications internes
- Messagerie interne
- Calendrier
- Statistiques administrateur
- Export CSV
- Assistant IA prototype
- Interface responsive avec Tailwind CSS

---

## Technologies utilisées

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MySQL2
- JWT
- BcryptJS
- Multer
- CORS
- Dotenv

### Base de données
- MySQL
- phpMyAdmin / XAMPP

---

## Architecture du projet

```txt
gestion-stages-app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── gestion_stages.sql
│
└── README.md
## Exécution avec Docker

Le projet peut être exécuté avec Docker sans utiliser XAMPP.

### Prérequis

- Docker Desktop installé et lancé

### Lancer le projet

```bash
docker compose up --build