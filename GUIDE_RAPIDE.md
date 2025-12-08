# Guide Rapide ALLOTRACTEUR API

## Démarrage en 5 minutes

### 1. Installation

```bash
npm install
cp .env.example .env
# Configurer .env avec vos credentials
```

### 2. Démarrer MongoDB

```bash
mongod
# Ou si MongoDB est déjà en cours d'exécution, passez à l'étape suivante
```

### 3. Seed les données de test

```bash
npm run seed
```

### 4. Démarrer le serveur

```bash
npm run dev
```

Le serveur démarre sur: `http://localhost:3000`

---

## Tests Rapides avec Postman

### 1. Importer la collection

- Ouvrir Postman
- Importer `POSTMAN_COLLECTION_COMPLETE.json`

### 2. Tester l'API

#### Inscription
```
POST http://localhost:3000/api/auth/register

Body:
{
  "nom": "Test",
  "prenom": "User",
  "email": "test@example.com",
  "telephone": "+221771234567",
  "motDePasse": "Password123!",
  "role": "producteur"
}
```

#### Connexion
```
POST http://localhost:3000/api/auth/login

Body:
{
  "email": "test@example.com",
  "motDePasse": "Password123!"
}
```

**Copier le token reçu et l'utiliser dans les requêtes suivantes:**

```
Authorization: Bearer <votre_token>
```

---

## Les 3 Dashboards

### 1. Dashboard Admin
- Rôle requis: `admin`
- URL: `GET /api/admin/statistics`
- Fonctions: Statistiques complètes, gestion utilisateurs, vue d'ensemble

### 2. Dashboard Producteur
- Rôle requis: `producteur`
- URL: `GET /api/producteur/dashboard`
- Fonctions: Mes réservations, paiements, avis, recherche machines

### 3. Dashboard Prestataire
- Rôle requis: `prestataire`
- URL: `GET /api/prestataire/dashboard`
- Fonctions: Mes machines, réservations, revenus, performances

---

## Routes Principales

### Authentification
```
POST   /api/auth/register        - Inscription
POST   /api/auth/login           - Connexion
POST   /api/auth/forgot-password - Mot de passe oublié
GET    /api/auth/profile         - Mon profil
```

### Machines
```
GET    /api/machines             - Liste machines
POST   /api/machines             - Créer machine (prestataire)
GET    /api/machines/:id         - Détails machine
PUT    /api/machines/:id         - Modifier machine
DELETE /api/machines/:id         - Supprimer machine
```

### Réservations
```
GET    /api/reservations         - Mes réservations
POST   /api/reservations         - Créer réservation (producteur)
PUT    /api/reservations/:id/confirm  - Confirmer (prestataire)
PUT    /api/reservations/:id/start    - Démarrer (prestataire)
PUT    /api/reservations/:id/complete - Terminer (prestataire)
```

### Paiements
```
POST   /api/payments/initiate    - Initier paiement
GET    /api/payments/:id/status  - Vérifier statut
GET    /api/payments             - Historique
```

---

## Comptes de Test (après seed)

### Admin
```
Email: admin@allotracteur.sn
Mot de passe: Admin123!
```

### Producteur
```
Email: producteur@allotracteur.sn
Mot de passe: Producteur123!
```

### Prestataire
```
Email: prestataire@allotracteur.sn
Mot de passe: Prestataire123!
```

---

## Variables d'Environnement Essentielles

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/allotracteur
JWT_SECRET=votre_secret_tres_securise
JWT_EXPIRES_IN=7d
```

---

## Commandes Utiles

```bash
npm start              # Démarrer en production
npm run dev            # Démarrer en développement
npm test               # Exécuter tests
npm run seed           # Seed la base
npm run logs           # Voir logs en temps réel
npm run verify         # Vérifier configuration
```

---

## Vérifier que tout fonctionne

### 1. Santé de l'API
```
GET http://localhost:3000/health
```

Réponse attendue:
```json
{
  "status": "OK",
  "message": "API ALLOTRACTEUR fonctionnelle",
  "timestamp": "...",
  "uptime": 123.45
}
```

### 2. Connexion base de données
Si le serveur démarre sans erreur, MongoDB est connecté.

### 3. Test complet
```bash
npm test
```

---

## Workflow Typique

### Pour un Producteur:

1. **S'inscrire** → POST `/api/auth/register` (role: producteur)
2. **Se connecter** → POST `/api/auth/login`
3. **Rechercher machines** → GET `/api/producteur/machines-disponibles`
4. **Créer réservation** → POST `/api/reservations`
5. **Payer** → POST `/api/payments/initiate`
6. **Laisser avis** → POST `/api/avis`

### Pour un Prestataire:

1. **S'inscrire** → POST `/api/auth/register` (role: prestataire)
2. **Se connecter** → POST `/api/auth/login`
3. **Ajouter machine** → POST `/api/machines`
4. **Voir réservations** → GET `/api/prestataire/reservations`
5. **Confirmer réservation** → PUT `/api/reservations/:id/confirm`
6. **Voir revenus** → GET `/api/prestataire/dashboard`

---

## Résolution de Problèmes

### Erreur MongoDB
```
Solution: Vérifier que MongoDB est démarré
Command: mongod
```

### Erreur JWT Token invalide
```
Solution: Se reconnecter pour obtenir un nouveau token
Route: POST /api/auth/login
```

### Erreur 403 Accès refusé
```
Solution: Vérifier que votre rôle correspond à la route
- Admin: routes /api/admin/*
- Producteur: routes /api/producteur/*
- Prestataire: routes /api/prestataire/*
```

### Port 3000 déjà utilisé
```
Solution: Changer PORT dans .env ou tuer le processus
Command: lsof -ti:3000 | xargs kill -9
```

---

## Documentation Complète

- **Documentation API:** `DOCUMENTATION_API_COMPLETE.md`
- **Collection Postman:** `POSTMAN_COLLECTION_COMPLETE.json`
- **Vue d'ensemble projet:** `PROJET_COMPLET_FINAL.md`
- **Guide déploiement:** `GUIDE_DEPLOIEMENT.md`

---

## Support

Email: support@allotracteur.sn
Téléphone: +221 33 XXX XX XX

---

**Bon développement! 🚀**
