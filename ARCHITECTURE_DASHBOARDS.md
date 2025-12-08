# Architecture des Dashboards - ALLOTRACTEUR

**Date:** 6 Décembre 2025
**Version:** 2.0.0

---

## Vue d'Ensemble

Le système dispose de **3 dashboards distincts** selon le rôle de l'utilisateur:

1. **Dashboard Admin** - Gestion complète de la plateforme
2. **Dashboard Prestataire** - Gestion des machines et revenus
3. **Dashboard Producteur** - Gestion des réservations et dépenses

---

## 1. Dashboard ADMIN

### Endpoint Principal
```
GET /api/admin/statistics
```

### Routes Disponibles

#### Gestion Utilisateurs
```
GET    /api/admin/users                  → Liste tous les utilisateurs
GET    /api/admin/users/:id              → Détails d'un utilisateur
PUT    /api/admin/users/:id/role         → ⭐ CHANGER LE RÔLE (admin uniquement)
PUT    /api/admin/users/:id/status       → Activer/Désactiver un utilisateur
DELETE /api/admin/users/:id              → Supprimer un utilisateur
```

#### Supervision Plateforme
```
GET /api/admin/machines                  → Toutes les machines
GET /api/admin/reservations              → Toutes les réservations
GET /api/admin/payments                  → Tous les paiements
```

### Changement de Rôle (ADMIN SEULEMENT) ⭐

**Endpoint:** `PUT /api/admin/users/:id/role`

**Fichier:** `src/controllers/controleur.admin.js:61-93`

**Body:**
```json
{
  "role": "producteur" | "prestataire" | "admin"
}
```

**Sécurité:**
- ✅ Protégé par middleware `isAdmin`
- ✅ Seul un administrateur peut changer les rôles
- ✅ Validation des rôles autorisés
- ✅ Logging de toutes les modifications

**Exemple:**
```javascript
// Changer un producteur en prestataire
PUT /api/admin/users/507f1f77bcf86cd799439011/role
{
  "role": "prestataire"
}
```

### Middleware Admin
```javascript
// src/routes/routes.admin.js
router.use(authenticate);    // Authentifié
router.use(isAdmin);         // Role = 'admin'
```

---

## 2. Dashboard PRESTATAIRE

### Endpoint Principal
```
GET /api/prestataire/dashboard
```

### Fichier Contrôleur
`src/controllers/controleur.prestataires.js:155-316`

### Routes Disponibles

#### Dashboard & Statistiques
```
GET /api/prestataire/dashboard                        → Stats complètes
GET /api/prestataire/machines/:machineId/statistiques → Stats par machine
GET /api/prestataire/calendrier                       → Calendrier réservations
```

#### Mes Ressources
```
GET /api/prestataire/machines      → Mes machines
GET /api/prestataire/reservations  → Mes réservations reçues
GET /api/prestataire/paiements     → Mes revenus
GET /api/prestataire/avis          → Mes avis reçus
```

### Données du Dashboard

#### Machines
```json
{
  "machines": {
    "total": 15,
    "disponibles": 12,
    "indisponibles": 3,
    "parType": [
      { "_id": "tracteur", "count": 10, "disponibles": 8 },
      { "_id": "moissonneuse", "count": 5, "disponibles": 4 }
    ]
  }
}
```

#### Réservations
```json
{
  "reservations": {
    "total": 156,
    "enAttente": 12,
    "confirmees": 23,
    "enCours": 8,
    "terminees": 98,
    "annulees": 15,
    "tauxOccupation": "68.59"
  }
}
```

#### Finances
```json
{
  "finances": {
    "revenuTotal": 2450000,
    "revenuParMois": [
      { "_id": { "year": 2025, "month": 11 }, "total": 450000, "count": 15 },
      { "_id": { "year": 2025, "month": 12 }, "total": 520000, "count": 18 }
    ]
  }
}
```

#### Performances
```json
{
  "performances": {
    "performancesMachines": [
      {
        "_id": "machineId",
        "nombreReservations": 45,
        "heuresTotal": 230,
        "machine": { "nom": "Tracteur John Deere", "type": "tracteur" }
      }
    ]
  }
}
```

#### Activité Récente
```json
{
  "activiteRecente": {
    "dernieresReservations": [...],
    "avisRecents": [...]
  }
}
```

### Middleware Prestataire
```javascript
// src/routes/routes.prestataire.js
router.use(authenticate);      // Authentifié
router.use(isPrestataire);     // Role = 'prestataire'
```

---

## 3. Dashboard PRODUCTEUR

### Endpoint Principal
```
GET /api/producteur/dashboard
```

### Fichier Contrôleur
`src/controllers/controleur.producteur.js:10-152`

### Routes Disponibles

#### Dashboard & Activité
```
GET /api/producteur/dashboard              → Stats complètes
GET /api/producteur/historique             → Historique réservations
GET /api/producteur/machines-disponibles   → Machines disponibles à réserver
```

#### Mes Activités
```
GET /api/producteur/reservations  → Mes réservations faites
GET /api/producteur/paiements     → Mes paiements effectués
GET /api/producteur/avis          → Mes avis donnés
```

### Données du Dashboard

#### Réservations
```json
{
  "reservations": {
    "total": 45,
    "enAttente": 3,
    "confirmees": 8,
    "enCours": 2,
    "terminees": 28,
    "annulees": 4
  }
}
```

#### Finances
```json
{
  "finances": {
    "depensesTotales": 850000,
    "depensesParMois": [
      { "_id": { "year": 2025, "month": 11 }, "total": 180000, "count": 8 },
      { "_id": { "year": 2025, "month": 12 }, "total": 220000, "count": 10 }
    ]
  }
}
```

#### Statistiques
```json
{
  "statistiques": {
    "reservationsParType": [
      { "_id": "tracteur", "count": 30 },
      { "_id": "moissonneuse", "count": 15 }
    ],
    "machinesPreferees": [
      {
        "_id": "machineId",
        "count": 12,
        "machine": { "nom": "Tracteur Massey Ferguson", "type": "tracteur" }
      }
    ]
  }
}
```

#### Activité Récente
```json
{
  "activiteRecente": {
    "dernieresReservations": [...],
    "avisRecents": [...]
  }
}
```

### Middleware Producteur
```javascript
// src/routes/routes.producteur.js
router.use(authenticate);      // Authentifié
router.use(isProducteur);      // Role = 'producteur'
```

---

## Sécurité des Rôles

### Middleware d'Authentification
**Fichier:** `src/middleware/middleware.authentification.js`

### Vérifications

#### 1. Authentification (Tous)
```javascript
function authenticate(req, res, next) {
  // Vérifie le JWT token
  // Ajoute req.user avec les infos utilisateur
}
```

#### 2. Vérification Admin
```javascript
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux administrateurs'
    });
  }
  next();
}
```

#### 3. Vérification Prestataire
```javascript
function isPrestataire(req, res, next) {
  if (req.user.role !== 'prestataire') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux prestataires'
    });
  }
  next();
}
```

#### 4. Vérification Producteur
```javascript
function isProducteur(req, res, next) {
  if (req.user.role !== 'producteur') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux producteurs'
    });
  }
  next();
}
```

---

## Flux de Changement de Rôle

### Processus Complet

```
1. User enregistré → Role par défaut: "producteur"
   └─ Modèle: src/models/modele.utilisateur.js
   └─ Default: role = 'producteur'

2. Admin se connecte au dashboard
   └─ GET /api/admin/users
   └─ Liste tous les utilisateurs avec leur rôle actuel

3. Admin change le rôle
   └─ PUT /api/admin/users/:userId/role
   └─ Body: { "role": "prestataire" }
   └─ Validation: ["producteur", "prestataire", "admin"]
   └─ Update en base de données
   └─ Log de l'opération

4. User se reconnecte
   └─ Nouveau JWT généré avec nouveau rôle
   └─ Accès au dashboard correspondant
```

### Exemple Concret

#### Avant:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nom": "Diallo",
  "prenom": "Mamadou",
  "role": "producteur",
  "email": "mamadou@example.com"
}
```

#### Changement (Admin):
```bash
PUT /api/admin/users/507f1f77bcf86cd799439011/role
Authorization: Bearer <admin_token>

{
  "role": "prestataire"
}
```

#### Après:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nom": "Diallo",
  "prenom": "Mamadou",
  "role": "prestataire",  ← Changé
  "email": "mamadou@example.com"
}
```

---

## Matrice d'Accès aux Dashboards

| Endpoint | Admin | Prestataire | Producteur |
|----------|-------|-------------|------------|
| `/api/admin/*` | ✅ | ❌ | ❌ |
| `/api/prestataire/*` | ❌ | ✅ | ❌ |
| `/api/producteur/*` | ❌ | ❌ | ✅ |

### Protection en Cascade
```
Route
  ↓
authenticate (JWT valide?)
  ↓
isAdmin / isPrestataire / isProducteur (Bon rôle?)
  ↓
Controller (Exécution)
```

---

## Fichiers Importants

### Routes
```
src/routes/routes.admin.js         → Dashboard Admin
src/routes/routes.prestataire.js   → Dashboard Prestataire
src/routes/routes.producteur.js    → Dashboard Producteur
```

### Contrôleurs
```
src/controllers/controleur.admin.js         → 9 fonctions admin
src/controllers/controleur.prestataires.js  → 12 fonctions prestataire
src/controllers/controleur.producteur.js    → 6 fonctions producteur
```

### Middleware
```
src/middleware/middleware.authentification.js
  ↳ authenticate()
  ↳ isAdmin()
  ↳ isPrestataire()
  ↳ isProducteur()
```

### Modèle
```
src/models/modele.utilisateur.js
  ↳ role: { type: String, enum: ['producteur', 'prestataire', 'admin'], default: 'producteur' }
```

---

## Récapitulatif

### ✅ Dashboards
- **Admin:** Gestion complète + changement rôles
- **Prestataire:** Machines, réservations reçues, revenus
- **Producteur:** Réservations faites, paiements, dépenses

### ✅ Sécurité
- Seul **Admin** peut changer les rôles
- Chaque dashboard protégé par middleware spécifique
- JWT token requis pour tous les accès
- Logs de toutes modifications

### ✅ Base de Données
- Changement de rôle = UPDATE MongoDB
- Pas d'interface publique pour changer le rôle
- Traçabilité complète des modifications

---

**Architecture sécurisée et conforme! ✅**
