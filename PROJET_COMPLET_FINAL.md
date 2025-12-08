# ALLOTRACTEUR - Projet Backend Complet

## Vue d'ensemble

**Version:** 2.0.0 - COMPLET ET A JOUR

API Backend complète pour la plateforme ALLOTRACTEUR - Mise en relation de producteurs agricoles et prestataires de services au Sénégal.

---

## Fonctionnalités Complètes

### 1. Système d'Authentification
- Inscription multi-rôles (Producteur, Prestataire, Admin)
- Connexion avec JWT
- Réinitialisation de mot de passe par OTP SMS
- Gestion de profil utilisateur
- Changement de mot de passe sécurisé

### 2. Dashboard Admin
- Statistiques générales complètes
- Gestion des utilisateurs (CRUD)
- Modification des rôles utilisateurs
- Activation/Désactivation de comptes
- Vue d'ensemble machines, réservations, paiements
- Graphiques de revenus par mois
- Activité récente (dernières réservations, paiements, utilisateurs)

### 3. Dashboard Producteur
- Statistiques personnelles
- Historique des réservations
- Suivi des paiements effectués
- Consultation des avis reçus
- Recherche de machines disponibles
- Filtrage par localisation et type
- Machines favorites
- Dépenses par mois

### 4. Dashboard Prestataire
- Statistiques de performance
- Gestion de machines (CRUD complet)
- Suivi des réservations
- Revenus et paiements reçus
- Avis et notes par machine
- Calendrier de disponibilités
- Taux d'occupation
- Performances par machine

### 5. Gestion des Machines
- Création avec upload d'images (Cloudinary)
- Modification et suppression
- Vérification de disponibilité
- Localisation géographique (MongoDB GeoJSON)
- Filtrage par type, disponibilité, prestataire
- Tarification flexible

### 6. Système de Réservations
- Création de réservations
- Workflow complet: en_attente → confirmee → en_cours → terminee
- Annulation avec raison
- Vérification de conflits de dates
- Calcul automatique du montant
- Notifications automatiques

### 7. Paiements Intégrés
- Intégration PayTech (API Sénégalaise)
- Initiation de paiement sécurisée
- Webhook pour notifications automatiques
- Historique complet
- Statuts: pending, valide, failed

### 8. Système d'Avis et Notes
- Notation 1-5 étoiles
- Commentaires
- Réponses des prestataires
- Signalement d'avis inappropriés
- Calcul de moyenne globale
- Avis par machine et prestataire

### 9. Recherche Avancée
- Recherche textuelle (machines, prestataires, services)
- Recherche géographique (rayon en km)
- Filtres: type, prix, note, disponibilité
- Tri et pagination

### 10. Notifications en Temps Réel
- Notifications pour toutes les actions
- Marquage lu/non-lu
- Compteur de non-lues
- Suppression individuelle
- Marquer tout comme lu

### 11. Historique Complet
- Historique des réservations
- Historique des paiements
- Activités récentes
- Filtrage par dates

### 12. Gestion des Services
- Création de services par prestataires
- Tarification par unité (hectare, heure, etc.)
- Description détaillée
- Durée estimée

---

## Architecture Technique

### Structure du Projet

```
allotracteur-api/
├── src/
│   ├── config/                    # Configurations
│   │   ├── configuration.base-donnees.js
│   │   ├── configuration.email.js
│   │   ├── configuration.i18n.js
│   │   ├── configuration.images.js
│   │   ├── configuration.paiements.js
│   │   ├── configuration.serveur.js
│   │   └── configuration.sms.js
│   │
│   ├── controllers/               # Contrôleurs (14 fichiers)
│   │   ├── controleur.admin.js
│   │   ├── controleur.authentification.js
│   │   ├── controleur.avis.js
│   │   ├── controleur.historique.js
│   │   ├── controleur.machines.js
│   │   ├── controleur.notifications.js
│   │   ├── controleur.paiements.js
│   │   ├── controleur.prestataire.js      # NOUVEAU
│   │   ├── controleur.prestataires.js
│   │   ├── controleur.producteur.js       # NOUVEAU
│   │   ├── controleur.recherche.js
│   │   ├── controleur.reservations.js
│   │   ├── controleur.services.js
│   │   └── controleur.utilisateurs.js
│   │
│   ├── data-access/               # Couche d'accès aux données
│   │   ├── depot.machines.js
│   │   ├── depot.paiements.js
│   │   ├── depot.prestataires.js
│   │   ├── depot.reservations.js
│   │   ├── depot.services.js
│   │   └── depot.utilisateurs.js
│   │
│   ├── middleware/                # Middlewares
│   │   ├── middleware.authentification.js
│   │   ├── middleware.erreurs.js
│   │   ├── middleware.i18n.js
│   │   └── middleware.validation.js
│   │
│   ├── models/                    # Modèles MongoDB (10 fichiers)
│   │   ├── modele.avis.js
│   │   ├── modele.historique.js
│   │   ├── modele.machine.js
│   │   ├── modele.notification.js
│   │   ├── modele.paiement.js
│   │   ├── modele.prestataire.js
│   │   ├── modele.producteur.js
│   │   ├── modele.reservation.js
│   │   ├── modele.service.js
│   │   └── modele.utilisateur.js
│   │
│   ├── routes/                    # Routes API (14 fichiers)
│   │   ├── routes.admin.js
│   │   ├── routes.authentification.js
│   │   ├── routes.avis.js
│   │   ├── routes.historique.js
│   │   ├── routes.machines.js
│   │   ├── routes.notifications.js
│   │   ├── routes.paiements.js
│   │   ├── routes.prestataire.js          # NOUVEAU
│   │   ├── routes.prestataires.js
│   │   ├── routes.producteur.js           # NOUVEAU
│   │   ├── routes.recherche.js
│   │   ├── routes.reservations.js
│   │   ├── routes.services.js
│   │   └── routes.utilisateurs.js
│   │
│   ├── services/                  # Services métier
│   │   ├── service.authentification.js
│   │   ├── service.disponibilite.js
│   │   ├── service.email.js
│   │   ├── service.images.js
│   │   ├── service.notifications.js
│   │   ├── service.paiements.js
│   │   ├── service.recherche.js
│   │   ├── service.reservations.js
│   │   ├── service.sms.js
│   │   └── service.telechargement.js
│   │
│   ├── utils/                     # Utilitaires
│   │   ├── utilitaire.geolocalisation.js
│   │   ├── utilitaire.logs.js
│   │   └── utilitaire.otp.js
│   │
│   ├── webhooks/                  # Webhooks externes
│   │   └── paytech.webhook.js
│   │
│   ├── seeders/                   # Données de test
│   │   └── seed.js
│   │
│   ├── application.js             # Configuration Express
│   └── serveur.js                 # Point d'entrée
│
├── tests/                         # Tests
│   ├── integration/
│   │   └── api.test.js
│   └── unit/
│       └── auth.test.js
│
├── logs/                          # Logs applicatifs
│   ├── combined.log
│   └── error.log
│
├── .env                           # Variables d'environnement
├── .env.example
├── .gitignore
├── package.json
├── jest.config.js
│
├── README.md                      # Documentation principale
├── DOCUMENTATION_API_COMPLETE.md  # Documentation API complète
├── POSTMAN_COLLECTION_COMPLETE.json  # Collection Postman
└── PROJET_COMPLET_FINAL.md        # Ce fichier
```

---

## Routes API Complètes

### Authentification (`/api/auth`)
- POST `/register` - Inscription
- POST `/login` - Connexion
- POST `/forgot-password` - Demande OTP
- POST `/verify-otp` - Vérifier OTP
- POST `/reset-password` - Réinitialiser mot de passe
- GET `/profile` - Profil utilisateur

### Admin (`/api/admin`) - Rôle: admin
- GET `/statistics` - Statistiques générales
- GET `/users` - Liste utilisateurs
- GET `/users/:id` - Détails utilisateur
- PUT `/users/:id/role` - Changer rôle
- PUT `/users/:id/status` - Activer/Désactiver
- DELETE `/users/:id` - Supprimer utilisateur
- GET `/machines` - Liste machines
- GET `/reservations` - Liste réservations
- GET `/payments` - Liste paiements

### Producteur (`/api/producteur`) - Rôle: producteur
- GET `/dashboard` - Statistiques producteur
- GET `/reservations` - Mes réservations
- GET `/paiements` - Mes paiements
- GET `/avis` - Mes avis
- GET `/machines-disponibles` - Machines disponibles
- GET `/historique` - Historique réservations

### Prestataire (`/api/prestataire`) - Rôle: prestataire
- GET `/dashboard` - Statistiques prestataire
- GET `/machines` - Mes machines
- GET `/reservations` - Mes réservations
- GET `/paiements` - Mes paiements reçus
- GET `/avis` - Mes avis reçus
- GET `/machines/:machineId/statistiques` - Stats machine
- GET `/calendrier` - Calendrier réservations

### Machines (`/api/machines`)
- GET `/` - Liste machines
- GET `/:id` - Détails machine
- POST `/` - Créer machine (prestataire)
- PUT `/:id` - Modifier machine
- DELETE `/:id` - Supprimer machine
- GET `/:id/disponibilites` - Vérifier disponibilité

### Réservations (`/api/reservations`)
- GET `/` - Liste réservations
- GET `/:id` - Détails réservation
- POST `/` - Créer réservation (producteur)
- PUT `/:id/confirm` - Confirmer (prestataire)
- PUT `/:id/cancel` - Annuler
- PUT `/:id/start` - Démarrer (prestataire)
- PUT `/:id/complete` - Terminer (prestataire)

### Paiements (`/api/payments`)
- POST `/initiate` - Initier paiement
- GET `/:id/status` - Statut paiement
- GET `/` - Historique paiements
- POST `/webhook/paytech` - Webhook PayTech

### Avis (`/api/avis`)
- POST `/` - Créer avis (producteur)
- GET `/machine/:machineId` - Avis machine
- GET `/prestataire/:prestataireId` - Avis prestataire
- POST `/:id/reponse` - Répondre à avis (prestataire)
- POST `/:id/signaler` - Signaler avis

### Recherche (`/api/recherche`)
- GET `/` - Recherche globale
- GET `/localisation` - Recherche géographique
- GET `/filtres` - Filtres avancés

### Notifications (`/api/notifications`)
- GET `/` - Liste notifications
- PUT `/:id/read` - Marquer comme lue
- PUT `/read-all` - Tout marquer comme lu
- DELETE `/:id` - Supprimer notification
- GET `/unread-count` - Nombre non lues

### Historique (`/api/historique`)
- GET `/reservations` - Historique réservations
- GET `/payments` - Historique paiements
- GET `/activites` - Activités récentes

### Autres Routes
- GET `/health` - Santé de l'API
- GET `/api/prestataires` - Liste prestataires
- GET `/api/prestataires/:id` - Détails prestataire
- GET `/api/services` - Liste services
- GET `/api/users` - Gestion utilisateurs

---

## Technologies Utilisées

### Backend
- **Node.js** 18+ - Runtime JavaScript
- **Express.js** 4.18 - Framework web
- **MongoDB** 8.0 - Base de données NoSQL
- **Mongoose** - ODM MongoDB

### Authentification & Sécurité
- **JWT** (jsonwebtoken) - Tokens d'authentification
- **bcryptjs** - Hashage de mots de passe
- **Helmet** - Sécurité headers HTTP
- **Express Rate Limit** - Protection contre DDoS
- **CORS** - Gestion CORS

### Services Externes
- **PayTech API** - Paiements mobile money Sénégal
- **Cloudinary** - Stockage d'images
- **Nodemailer** - Envoi d'emails
- **API SMS** - Envoi de SMS/OTP

### Outils & Utilitaires
- **Winston** - Logging avancé
- **Morgan** - Logging HTTP
- **Multer** - Upload de fichiers
- **Compression** - Compression gzip
- **Joi** - Validation de données
- **Axios** - Requêtes HTTP

### Tests
- **Jest** - Framework de tests
- **Supertest** - Tests d'API

---

## Installation et Démarrage

### Prérequis
- Node.js 18+
- MongoDB 8.0+
- npm 9+

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd allotracteur-api

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Démarrer MongoDB
mongod

# Seed la base de données (optionnel)
npm run seed

# Démarrer le serveur
npm start          # Production
npm run dev        # Développement avec nodemon
```

### Variables d'Environnement Requises

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
MONGODB_URI=mongodb://localhost:27017/allotracteur

# JWT
JWT_SECRET=votre_secret_super_securise
JWT_EXPIRES_IN=7d

# PayTech
PAYTECH_API_KEY=votre_cle_api_paytech
PAYTECH_API_SECRET=votre_secret_paytech
PAYTECH_CALLBACK_URL=http://localhost:3000/api/payments/webhook/paytech

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_app
EMAIL_FROM=ALLOTRACTEUR <noreply@allotracteur.sn>

# SMS
SMS_API_KEY=votre_cle_api_sms
SMS_SENDER=ALLOTRACTEUR

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Scripts NPM Disponibles

```bash
npm start              # Démarrer en production
npm run dev            # Démarrer en développement
npm test               # Exécuter tous les tests
npm run test:watch     # Tests en mode watch
npm run test:unit      # Tests unitaires
npm run test:integration  # Tests d'intégration
npm run seed           # Seed la base de données
npm run seed:clear     # Nettoyer et seed
npm run logs           # Voir les logs en temps réel
npm run verify         # Vérifier la configuration
npm run build          # Build pour déploiement
```

---

## Tests

### Exécuter les tests

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

## Documentation

### Fichiers de Documentation
1. **README.md** - Documentation générale
2. **DOCUMENTATION_API_COMPLETE.md** - Documentation API complète (ce fichier est LA référence)
3. **POSTMAN_COLLECTION_COMPLETE.json** - Collection Postman complète
4. **API.md** - Documentation API originale
5. **GUIDE_DEPLOIEMENT.md** - Guide de déploiement

### Importer dans Postman

1. Ouvrir Postman
2. File → Import
3. Sélectionner `POSTMAN_COLLECTION_COMPLETE.json`
4. Configurer la variable `{{base_url}}` si nécessaire
5. Après connexion, définir `{{auth_token}}` avec le token reçu

---

## Sécurité

### Mesures de Sécurité Implémentées

1. **Authentification JWT**
   - Tokens avec expiration
   - Refresh tokens supportés
   - Signature sécurisée

2. **Protection des Routes**
   - Middleware d'authentification
   - Middleware de rôles (admin, producteur, prestataire)
   - Vérification de propriété des ressources

3. **Validation des Données**
   - Validation Joi sur toutes les entrées
   - Sanitization des données
   - Protection contre injection

4. **Rate Limiting**
   - Limite de requêtes par IP
   - Protection contre brute force
   - Protection des routes sensibles

5. **Headers de Sécurité**
   - Helmet.js configuré
   - CORS restreint
   - CSP headers

6. **Mots de Passe**
   - Hashage bcrypt (10 rounds)
   - Validation force du mot de passe
   - OTP pour réinitialisation

7. **Logs et Monitoring**
   - Winston logging
   - Logs d'erreurs séparés
   - Tracking des actions sensibles

---

## Performance

### Optimisations Implémentées

1. **Base de Données**
   - Index sur champs fréquemment requêtés
   - Index géographiques (2dsphere)
   - Pagination sur toutes les listes
   - Population selective

2. **Compression**
   - Gzip sur toutes les réponses
   - Compression des images

3. **Cache**
   - Cache potentiel pour recherches
   - Headers cache-control

4. **Requêtes**
   - Aggregation MongoDB pour statistiques
   - Requêtes optimisées
   - Projections limitées

---

## Déploiement

### Options de Déploiement

1. **Serveur VPS**
   - Ubuntu 20.04+
   - Nginx reverse proxy
   - PM2 pour process management
   - SSL avec Let's Encrypt

2. **Cloud Platforms**
   - Heroku
   - DigitalOcean
   - AWS EC2
   - Google Cloud

3. **MongoDB**
   - MongoDB Atlas (recommandé)
   - MongoDB sur VPS
   - Backup automatique

Voir `GUIDE_DEPLOIEMENT.md` pour les instructions détaillées.

---

## Monitoring et Logs

### Logs Disponibles

```bash
# Logs combinés
tail -f logs/combined.log

# Logs d'erreurs uniquement
tail -f logs/error.log

# Logs en temps réel
npm run logs
```

### Niveaux de Logs
- **error**: Erreurs critiques
- **warn**: Avertissements
- **info**: Informations générales
- **http**: Requêtes HTTP
- **debug**: Informations de débogage

---

## Support et Maintenance

### Contact
- Email: support@allotracteur.sn
- Téléphone: +221 33 XXX XX XX

### Maintenance
- Backup quotidien de la base de données
- Logs rotatifs (7 jours)
- Monitoring des performances
- Mise à jour des dépendances mensuelles

---

## Roadmap Future

### Fonctionnalités à Venir (v3.0)
- [ ] Chat en temps réel (Socket.io)
- [ ] Notifications push (Firebase)
- [ ] Export de données (PDF, Excel)
- [ ] Système de facturation automatique
- [ ] Programme de fidélité
- [ ] API GraphQL
- [ ] Application mobile (React Native)
- [ ] Tableau de bord analytics avancé
- [ ] Support multi-langues complet
- [ ] Intégration Orange Money / Wave
- [ ] Géolocalisation en temps réel des machines
- [ ] Système de parrainage

---

## Changelog

### Version 2.0.0 (Décembre 2025) - ACTUEL
- Dashboard Admin complet
- Dashboard Producteur complet (NOUVEAU)
- Dashboard Prestataire complet (NOUVEAU)
- Middlewares isProducteur et isPrestataire
- Documentation API complète mise à jour
- Collection Postman complète
- Routes dashboard intégrées

### Version 1.0.0
- API de base fonctionnelle
- Authentification JWT
- Gestion machines et réservations
- Paiements PayTech
- Système d'avis

---

## Contributeurs

- **Équipe ALLOTRACTEUR**
- Lead Developer: [Votre nom]
- Backend Developer: [Votre nom]

---

## Licence

ISC License

Copyright (c) 2025 ALLOTRACTEUR

---

## Notes Importantes

### Pour les Développeurs

1. **Toujours valider les données** avant de les enregistrer
2. **Logger les actions importantes** pour le debugging
3. **Tester avant de déployer** en production
4. **Suivre les conventions** de code établies
5. **Documenter les nouvelles routes** dans DOCUMENTATION_API_COMPLETE.md

### Pour les Testeurs

1. Utiliser la collection Postman fournie
2. Tester tous les scénarios (succès et erreurs)
3. Vérifier les permissions par rôle
4. Tester la pagination sur toutes les listes
5. Vérifier les validations de données

### Pour les Admins

1. Configurer correctement toutes les variables d'environnement
2. Activer les backups MongoDB
3. Monitorer les logs régulièrement
4. Mettre à jour les dépendances de sécurité
5. Configurer le firewall (port 3000 uniquement)

---

**FIN DU DOCUMENT - PROJET COMPLET ET PRÊT POUR PRODUCTION**
