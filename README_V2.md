# 🚜 ALLOTRACTEUR - API Backend v2.0.0

**Plateforme de mise en relation entre producteurs agricoles et prestataires de services au Sénégal**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-orange.svg)]()
[![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)]()

---

## 🎉 NOUVEAUTÉS VERSION 2.0.0

### 🆕 Dashboards Complets
- ✅ **Dashboard Admin** - Statistiques globales, gestion utilisateurs complète
- ✅ **Dashboard Producteur** - Mes réservations, paiements, avis, recherche machines
- ✅ **Dashboard Prestataire** - Mes machines, revenus, performances, calendrier

### 📊 Statistiques Avancées
- ✅ Revenus par mois (graphiques)
- ✅ Taux d'occupation des machines
- ✅ Performances par machine
- ✅ Machines favorites
- ✅ Activité récente

### 🔐 Contrôle d'Accès Renforcé
- ✅ Middlewares par rôle (admin, producteur, prestataire)
- ✅ Vérification de propriété des ressources
- ✅ Protection multi-niveaux

### 📚 Documentation Exhaustive
- ✅ 65+ endpoints documentés
- ✅ Collection Postman complète
- ✅ Guide de démarrage rapide
- ✅ Exemples d'intégration

---

## 📚 DOCUMENTATION

### Guides Essentiels
- 🚀 **[Guide Rapide](GUIDE_RAPIDE.md)** - Démarrer en 5 minutes
- 📖 **[Documentation API Complète](DOCUMENTATION_API_COMPLETE.md)** - Tous les endpoints
- 📋 **[Liste des Endpoints](LISTE_COMPLETE_ENDPOINTS.md)** - Vue d'ensemble
- 🎁 **[Nouveautés v2.0](NOUVEAUTES_V2.md)** - Changelog détaillé
- 📦 **[Projet Complet](PROJET_COMPLET_FINAL.md)** - Architecture complète

### Outils
- 📮 **[Collection Postman](POSTMAN_COLLECTION_COMPLETE.json)** - Tests API
- 🌐 **[Guide Déploiement](GUIDE_DEPLOIEMENT.md)** - Production

---

## 🎯 FONCTIONNALITÉS COMPLÈTES

### Authentification & Utilisateurs
- ✅ Inscription multi-rôles (Producteur, Prestataire, Admin)
- ✅ Connexion JWT sécurisée
- ✅ Réinitialisation mot de passe par OTP SMS
- ✅ Gestion de profil
- ✅ Changement mot de passe

### Pour les Producteurs
- ✅ Dashboard personnalisé avec statistiques
- ✅ Recherche machines par localisation (géographique)
- ✅ Création de réservations
- ✅ Suivi des paiements
- ✅ Historique complet
- ✅ Consultation des avis
- ✅ Dépenses par mois

### Pour les Prestataires
- ✅ Dashboard avec performances
- ✅ Gestion complète des machines (CRUD)
- ✅ Calendrier des réservations
- ✅ Suivi des revenus
- ✅ Statistiques par machine
- ✅ Avis clients
- ✅ Taux d'occupation

### Pour les Administrateurs
- ✅ Dashboard global
- ✅ Gestion utilisateurs (activation, rôles, suppression)
- ✅ Vue d'ensemble machines, réservations, paiements
- ✅ Statistiques complètes
- ✅ Revenus par mois
- ✅ Activité récente

### Système de Réservations
- ✅ Création avec vérification de disponibilité
- ✅ Workflow: en_attente → confirmee → en_cours → terminee
- ✅ Annulation avec raison
- ✅ Calcul automatique du montant
- ✅ Notifications automatiques

### Paiements
- ✅ Intégration PayTech (mobile money Sénégal)
- ✅ Wave, Orange Money, Free Money
- ✅ Webhook automatique
- ✅ Historique complet
- ✅ Statuts en temps réel

### Machines
- ✅ Upload d'images (Cloudinary)
- ✅ Géolocalisation (MongoDB GeoJSON)
- ✅ Vérification de disponibilité
- ✅ Filtrage par type, prix, note
- ✅ Tarification flexible

### Avis & Notations
- ✅ Notes 1-5 étoiles
- ✅ Commentaires
- ✅ Réponses des prestataires
- ✅ Signalement
- ✅ Moyenne globale

### Recherche
- ✅ Recherche textuelle
- ✅ Recherche géographique (rayon km)
- ✅ Filtres avancés
- ✅ Tri et pagination

### Notifications
- ✅ Notifications en temps réel
- ✅ Marquage lu/non-lu
- ✅ Compteur
- ✅ Suppression

---

## 🏗️ ARCHITECTURE

### Structure du Projet

```
allotracteur-api/
├── src/
│   ├── config/              # Configurations (7 fichiers)
│   ├── controllers/         # Contrôleurs (14 fichiers)
│   │   ├── controleur.admin.js
│   │   ├── controleur.producteur.js    ⭐ NOUVEAU
│   │   ├── controleur.prestataire.js   ⭐ NOUVEAU
│   │   └── ...
│   ├── data-access/         # Dépôts (6 fichiers)
│   ├── middleware/          # Middlewares (4 fichiers)
│   ├── models/              # Modèles MongoDB (10 fichiers)
│   ├── routes/              # Routes (14 fichiers)
│   │   ├── routes.producteur.js        ⭐ NOUVEAU
│   │   ├── routes.prestataire.js       ⭐ NOUVEAU
│   │   └── ...
│   ├── services/            # Services (10 fichiers)
│   ├── utils/               # Utilitaires (3 fichiers)
│   ├── webhooks/            # Webhooks (1 fichier)
│   ├── seeders/             # Seed data (1 fichier)
│   ├── application.js
│   └── serveur.js
├── tests/                   # Tests
├── logs/                    # Logs
├── DOCUMENTATION_API_COMPLETE.md     ⭐ NOUVEAU
├── POSTMAN_COLLECTION_COMPLETE.json  ⭐ NOUVEAU
├── PROJET_COMPLET_FINAL.md           ⭐ NOUVEAU
├── GUIDE_RAPIDE.md                   ⭐ NOUVEAU
├── LISTE_COMPLETE_ENDPOINTS.md       ⭐ NOUVEAU
├── NOUVEAUTES_V2.md                  ⭐ NOUVEAU
└── package.json
```

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Prérequis
- Node.js 18+
- MongoDB 8.0+
- npm 9+

### 2. Installation

```bash
# Cloner
git clone <repository-url>
cd allotracteur-api

# Installer dépendances
npm install

# Configurer .env
cp .env.example .env
# Éditer .env avec vos credentials
```

### 3. Démarrer

```bash
# Seed la base (optionnel)
npm run seed

# Démarrer le serveur
npm run dev
```

API disponible sur: `http://localhost:3000`

### 4. Tester avec Postman

1. Importer `POSTMAN_COLLECTION_COMPLETE.json`
2. Configurer `{{base_url}}` = `http://localhost:3000/api`
3. S'inscrire/Se connecter
4. Utiliser le token reçu dans les requêtes

---

## 📊 STATISTIQUES DU PROJET

| Catégorie | Nombre |
|-----------|--------|
| **Endpoints** | 65+ |
| **Contrôleurs** | 14 |
| **Routes** | 14 |
| **Modèles** | 10 |
| **Services** | 10 |
| **Middlewares** | 4 |
| **Dashboards** | 3 |

---

## 🔑 ROUTES PRINCIPALES

### Authentification
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
GET    /api/auth/profile
```

### Dashboard Admin (rôle: admin)
```
GET    /api/admin/statistics
GET    /api/admin/users
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

### Dashboard Producteur (rôle: producteur)
```
GET    /api/producteur/dashboard
GET    /api/producteur/reservations
GET    /api/producteur/machines-disponibles
GET    /api/producteur/historique
```

### Dashboard Prestataire (rôle: prestataire)
```
GET    /api/prestataire/dashboard
GET    /api/prestataire/machines
GET    /api/prestataire/calendrier
GET    /api/prestataire/machines/:id/statistiques
```

### Machines
```
GET    /api/machines
POST   /api/machines             (prestataire)
PUT    /api/machines/:id         (prestataire)
DELETE /api/machines/:id         (prestataire)
```

### Réservations
```
GET    /api/reservations
POST   /api/reservations         (producteur)
PUT    /api/reservations/:id/confirm    (prestataire)
PUT    /api/reservations/:id/complete   (prestataire)
```

### Paiements
```
POST   /api/payments/initiate
GET    /api/payments/:id/status
```

Voir [LISTE_COMPLETE_ENDPOINTS.md](LISTE_COMPLETE_ENDPOINTS.md) pour tous les endpoints.

---

## 🛠️ TECHNOLOGIES

### Backend
- **Node.js** 18+ - Runtime
- **Express.js** 4.18 - Framework
- **MongoDB** 8.0 - Base de données
- **Mongoose** - ODM

### Sécurité
- **JWT** - Authentification
- **bcryptjs** - Hash mots de passe
- **Helmet** - Headers sécurisés
- **Rate Limiting** - Anti DDoS

### Services
- **PayTech** - Paiements mobile money
- **Cloudinary** - Stockage images
- **Nodemailer** - Emails
- **API SMS** - SMS/OTP

### Outils
- **Winston** - Logging
- **Jest** - Tests
- **Morgan** - HTTP logs
- **Joi** - Validation

---

## 🧪 TESTS

```bash
# Tous les tests
npm test

# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Avec couverture
npm test -- --coverage
```

---

## 📦 SCRIPTS NPM

```bash
npm start              # Production
npm run dev            # Développement
npm test               # Tests
npm run seed           # Seed DB
npm run logs           # Logs temps réel
npm run verify         # Vérifier config
npm run build          # Build
```

---

## 🔒 SÉCURITÉ

### Mesures Implémentées
- ✅ JWT avec expiration
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet headers
- ✅ Validation Joi
- ✅ Hash bcrypt (10 rounds)
- ✅ CORS configuré
- ✅ Logs sécurisés

---

## 📈 PERFORMANCE

### Optimisations
- ✅ Pagination sur toutes les listes
- ✅ Index MongoDB
- ✅ Compression gzip
- ✅ Aggregation pour statistiques
- ✅ Cache headers
- ✅ Population sélective

---

## 🌍 DÉPLOIEMENT

### Options
- VPS (Ubuntu + Nginx + PM2)
- Heroku
- DigitalOcean
- AWS EC2
- Google Cloud

### MongoDB
- MongoDB Atlas (recommandé)
- MongoDB sur VPS

Voir [GUIDE_DEPLOIEMENT.md](GUIDE_DEPLOIEMENT.md)

---

## 🔍 COMPTES DE TEST

Après `npm run seed`:

```
Admin:       admin@allotracteur.sn / Admin123!
Producteur:  producteur@allotracteur.sn / Producteur123!
Prestataire: prestataire@allotracteur.sn / Prestataire123!
```

---

## 📝 VARIABLES D'ENVIRONNEMENT

```env
# Serveur
PORT=3000
NODE_ENV=production

# Base de données
MONGODB_URI=mongodb://localhost:27017/allotracteur

# JWT
JWT_SECRET=votre_secret_super_securise
JWT_EXPIRES_IN=7d

# PayTech
PAYTECH_API_KEY=votre_cle
PAYTECH_API_SECRET=votre_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud
CLOUDINARY_API_KEY=votre_cle
CLOUDINARY_API_SECRET=votre_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=votre_email
EMAIL_PASSWORD=votre_mot_de_passe

# SMS
SMS_API_KEY=votre_cle
```

Voir `.env.example` pour la liste complète.

---

## 📖 DOCUMENTATION DÉTAILLÉE

### Pour Démarrer
1. **[GUIDE_RAPIDE.md](GUIDE_RAPIDE.md)** - Installation et premiers pas

### Pour Développer
2. **[DOCUMENTATION_API_COMPLETE.md](DOCUMENTATION_API_COMPLETE.md)** - Référence API
3. **[LISTE_COMPLETE_ENDPOINTS.md](LISTE_COMPLETE_ENDPOINTS.md)** - Liste endpoints
4. **[PROJET_COMPLET_FINAL.md](PROJET_COMPLET_FINAL.md)** - Architecture

### Pour Tester
5. **[POSTMAN_COLLECTION_COMPLETE.json](POSTMAN_COLLECTION_COMPLETE.json)** - Collection Postman

### Pour Déployer
6. **[GUIDE_DEPLOIEMENT.md](GUIDE_DEPLOIEMENT.md)** - Déploiement production

### Changelog
7. **[NOUVEAUTES_V2.md](NOUVEAUTES_V2.md)** - Nouveautés v2.0

---

## 🗺️ ROADMAP

### v3.0 (Futur)
- [ ] WebSockets (notifications temps réel)
- [ ] Notifications push mobile
- [ ] Export PDF/Excel
- [ ] Graphiques interactifs
- [ ] Chat en temps réel
- [ ] Application mobile
- [ ] API GraphQL
- [ ] Programme fidélité
- [ ] Multi-langues complet
- [ ] IA prédictive

---

## 🤝 CONTRIBUTION

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📞 SUPPORT

- **Email:** support@allotracteur.sn
- **Téléphone:** +221 33 XXX XX XX
- **Documentation:** Voir fichiers de documentation

---

## 👥 ÉQUIPE

- **Lead Developer:** Backend Team
- **Documentation:** Tech Writing Team
- **Tests:** QA Team

---

## 📄 LICENCE

ISC License

Copyright (c) 2025 ALLOTRACTEUR

---

## ⭐ REMERCIEMENTS

Merci à tous les contributeurs et utilisateurs de la plateforme ALLOTRACTEUR.

---

## 🎯 STATUT

- ✅ **Version:** 2.0.0
- ✅ **Statut:** Production Ready
- ✅ **Tests:** Passing
- ✅ **Documentation:** Complète
- ✅ **Sécurité:** Validée
- ✅ **Performance:** Optimisée

---

**Développé avec ❤️ pour l'agriculture sénégalaise**

🚜 **ALLOTRACTEUR - Louez. Travaillez. Récoltez.**
