# Documentation API ALLOTRACTEUR - Version Complète

**Base URL:** `http://localhost:3000/api`

**Version:** 2.0.0

**Dernière mise à jour:** 6 Décembre 2025

---

## Table des Matières

1. [Authentification](#authentification)
2. [Dashboard Admin](#dashboard-admin)
3. [Dashboard Producteur](#dashboard-producteur)
4. [Dashboard Prestataire](#dashboard-prestataire)
5. [Gestion des Utilisateurs](#gestion-des-utilisateurs)
6. [Gestion des Prestataires](#gestion-des-prestataires)
7. [Gestion des Machines](#gestion-des-machines)
8. [Gestion des Services](#gestion-des-services)
9. [Gestion des Réservations](#gestion-des-réservations)
10. [Gestion des Paiements](#gestion-des-paiements)
11. [Gestion des Avis](#gestion-des-avis)
12. [Recherche](#recherche)
13. [Notifications](#notifications)
14. [Historique](#historique)

---

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

### 1. Inscription

**POST** `/api/auth/register`

**Body:**
```json
{
  "nom": "Diallo",
  "prenom": "Mamadou",
  "email": "mamadou@example.com",
  "telephone": "+221771234567",
  "motDePasse": "Password123!",
  "role": "producteur",
  "adresse": "Dakar, Sénégal"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Connexion

**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "mamadou@example.com",
  "motDePasse": "Password123!"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Demande OTP (Mot de passe oublié)

**POST** `/api/auth/forgot-password`

**Body:**
```json
{
  "telephone": "+221771234567"
}
```

### 4. Vérification OTP

**POST** `/api/auth/verify-otp`

**Body:**
```json
{
  "telephone": "+221771234567",
  "code": "123456"
}
```

### 5. Réinitialisation du mot de passe

**POST** `/api/auth/reset-password`

**Body:**
```json
{
  "telephone": "+221771234567",
  "code": "123456",
  "nouveauMotDePasse": "NewPassword123!"
}
```

### 6. Profil utilisateur

**GET** `/api/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "nom": "Diallo",
      "prenom": "Mamadou",
      "email": "mamadou@example.com",
      "role": "producteur",
      ...
    }
  }
}
```

---

## Dashboard Admin

**Toutes les routes nécessitent le rôle `admin`**

### 1. Statistiques générales

**GET** `/api/admin/statistics`

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "utilisateurs": {
      "total": 150,
      "producteurs": 100,
      "prestataires": 45,
      "admins": 5,
      "actifs": 140,
      "inactifs": 10
    },
    "machines": {
      "total": 80,
      "disponibles": 60,
      "indisponibles": 20,
      "parType": [...]
    },
    "reservations": {
      "total": 320,
      "confirmees": 250,
      "enAttente": 30,
      "enCours": 20,
      "terminees": 200,
      "annulees": 20
    },
    "paiements": {
      "total": 280,
      "valides": 250,
      "pending": 20,
      "echoues": 10,
      "revenuTotal": 15000000,
      "revenuParMois": [...]
    },
    "avis": {
      "total": 180,
      "moyenneGlobale": 4.3
    },
    "notifications": {
      "total": 520,
      "nonLues": 45
    },
    "activiteRecente": {
      "dernieresReservations": [...],
      "derniersPaiements": [...],
      "derniersUtilisateurs": [...]
    }
  }
}
```

### 2. Liste des utilisateurs

**GET** `/api/admin/users`

**Query Params:**
- `role` (optionnel): producteur | prestataire | admin
- `isActive` (optionnel): true | false
- `page` (défaut: 1)
- `limit` (défaut: 50)

**Exemple:** `/api/admin/users?role=producteur&page=1&limit=20`

### 3. Détails d'un utilisateur

**GET** `/api/admin/users/:id`

### 4. Changer le rôle d'un utilisateur

**PUT** `/api/admin/users/:id/role`

**Body:**
```json
{
  "role": "prestataire"
}
```

### 5. Activer/Désactiver un utilisateur

**PUT** `/api/admin/users/:id/status`

**Body:**
```json
{
  "isActive": false
}
```

### 6. Supprimer un utilisateur

**DELETE** `/api/admin/users/:id`

### 7. Liste des machines (Admin)

**GET** `/api/admin/machines`

**Query Params:**
- `disponible` (optionnel): true | false
- `type` (optionnel): tracteur | moissonneuse | etc.
- `page`, `limit`

### 8. Liste des réservations (Admin)

**GET** `/api/admin/reservations`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

### 9. Liste des paiements (Admin)

**GET** `/api/admin/payments`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

---

## Dashboard Producteur

**Toutes les routes nécessitent le rôle `producteur`**

### 1. Statistiques du producteur

**GET** `/api/producteur/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "reservations": {
      "total": 25,
      "enAttente": 3,
      "confirmees": 5,
      "enCours": 2,
      "terminees": 12,
      "annulees": 3
    },
    "finances": {
      "depensesTotales": 1500000,
      "depensesParMois": [...]
    },
    "statistiques": {
      "reservationsParType": [...],
      "machinesPreferees": [...]
    },
    "activiteRecente": {
      "dernieresReservations": [...],
      "avisRecents": [...]
    }
  }
}
```

### 2. Mes réservations

**GET** `/api/producteur/reservations`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

### 3. Mes paiements

**GET** `/api/producteur/paiements`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

### 4. Mes avis reçus

**GET** `/api/producteur/avis`

**Query Params:**
- `page`, `limit`

### 5. Machines disponibles

**GET** `/api/producteur/machines-disponibles`

**Query Params:**
- `type` (optionnel)
- `localisation` (optionnel): "longitude,latitude"
- `rayon` (optionnel, défaut: 50 km)
- `page`, `limit`

### 6. Historique des réservations

**GET** `/api/producteur/historique`

**Query Params:**
- `annee` (optionnel)
- `mois` (optionnel)

---

## Dashboard Prestataire

**Toutes les routes nécessitent le rôle `prestataire`**

### 1. Statistiques du prestataire

**GET** `/api/prestataire/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "machines": {
      "total": 5,
      "disponibles": 4,
      "indisponibles": 1,
      "parType": [...]
    },
    "reservations": {
      "total": 45,
      "enAttente": 5,
      "confirmees": 8,
      "enCours": 3,
      "terminees": 25,
      "annulees": 4,
      "tauxOccupation": "68.89"
    },
    "finances": {
      "revenuTotal": 3200000,
      "revenuParMois": [...]
    },
    "performances": {
      "performancesMachines": [...]
    },
    "activiteRecente": {
      "dernieresReservations": [...],
      "avisRecents": [...]
    }
  }
}
```

### 2. Mes machines

**GET** `/api/prestataire/machines`

**Query Params:**
- `disponible` (optionnel)
- `type` (optionnel)
- `page`, `limit`

### 3. Mes réservations

**GET** `/api/prestataire/reservations`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

### 4. Mes paiements reçus

**GET** `/api/prestataire/paiements`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

### 5. Mes avis reçus

**GET** `/api/prestataire/avis`

**Query Params:**
- `page`, `limit`

### 6. Statistiques d'une machine

**GET** `/api/prestataire/machines/:machineId/statistiques`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "machine": {...},
    "statistiques": {
      "totalReservations": 15,
      "reservationsTerminees": 12,
      "heuresUtilisation": 180,
      "revenuTotal": 900000,
      "moyenneAvis": 4.5,
      "nombreAvis": 10
    },
    "avisRecents": [...]
  }
}
```

### 7. Calendrier des réservations

**GET** `/api/prestataire/calendrier`

**Query Params:**
- `machineId` (optionnel)
- `annee` (optionnel)
- `mois` (optionnel)

---

## Gestion des Utilisateurs

### 1. Liste des utilisateurs

**GET** `/api/users`

**Query Params:**
- `role`, `isActive`, `page`, `limit`

### 2. Profil d'un utilisateur

**GET** `/api/users/:id`

### 3. Mettre à jour son profil

**PUT** `/api/users/profile`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nom": "Nouveau nom",
  "prenom": "Nouveau prénom",
  "telephone": "+221771234567",
  "adresse": "Nouvelle adresse"
}
```

### 4. Changer son mot de passe

**PUT** `/api/users/change-password`

**Body:**
```json
{
  "ancienMotDePasse": "OldPassword123!",
  "nouveauMotDePasse": "NewPassword123!"
}
```

### 5. Supprimer son compte

**DELETE** `/api/users/profile`

---

## Gestion des Prestataires

### 1. Liste des prestataires

**GET** `/api/prestataires`

**Query Params:**
- `page`, `limit`
- `ville` (optionnel)
- `noteMin` (optionnel)

### 2. Détails d'un prestataire

**GET** `/api/prestataires/:id`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "prestataire": {
      "_id": "...",
      "nom": "Diop",
      "prenom": "Ibrahima",
      "noteGlobale": 4.5,
      "nombreAvis": 25,
      "machines": [...],
      ...
    }
  }
}
```

### 3. Machines d'un prestataire

**GET** `/api/prestataires/:id/machines`

### 4. Avis d'un prestataire

**GET** `/api/prestataires/:id/avis`

**Query Params:**
- `page`, `limit`

---

## Gestion des Machines

### 1. Liste des machines

**GET** `/api/machines`

**Query Params:**
- `type` (optionnel)
- `disponible` (optionnel)
- `prestataireId` (optionnel)
- `page`, `limit`

### 2. Détails d'une machine

**GET** `/api/machines/:id`

### 3. Créer une machine (Prestataire)

**POST** `/api/machines`

**Headers:** `Authorization: Bearer <token>` (rôle: prestataire)

**Body (multipart/form-data):**
```json
{
  "nom": "Tracteur John Deere 6120M",
  "type": "tracteur",
  "marque": "John Deere",
  "modele": "6120M",
  "annee": 2020,
  "puissance": "120 CV",
  "description": "Tracteur moderne avec GPS",
  "tarifParHeure": 15000,
  "localisation": {
    "adresse": "Thiès, Sénégal",
    "coordinates": [-16.9331, 14.7934]
  },
  "disponible": true,
  "images": [files]
}
```

### 4. Mettre à jour une machine

**PUT** `/api/machines/:id`

**Headers:** `Authorization: Bearer <token>` (propriétaire)

### 5. Supprimer une machine

**DELETE** `/api/machines/:id`

**Headers:** `Authorization: Bearer <token>` (propriétaire)

### 6. Disponibilités d'une machine

**GET** `/api/machines/:id/disponibilites`

**Query Params:**
- `dateDebut` (format: YYYY-MM-DD)
- `dateFin` (format: YYYY-MM-DD)

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "disponible": true,
    "reservations": [...]
  }
}
```

---

## Gestion des Services

### 1. Liste des services

**GET** `/api/services`

### 2. Créer un service (Prestataire)

**POST** `/api/services`

**Body:**
```json
{
  "nom": "Labour profond",
  "description": "Service de labour avec tracteur 120 CV",
  "tarif": 20000,
  "unite": "hectare",
  "dureeEstimee": 2
}
```

### 3. Mettre à jour un service

**PUT** `/api/services/:id`

### 4. Supprimer un service

**DELETE** `/api/services/:id`

---

## Gestion des Réservations

### 1. Liste des réservations

**GET** `/api/reservations`

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

### 2. Créer une réservation (Producteur)

**POST** `/api/reservations`

**Headers:** `Authorization: Bearer <token>` (rôle: producteur)

**Body:**
```json
{
  "machineId": "machine_id",
  "dateDebut": "2025-12-10T08:00:00Z",
  "dateFin": "2025-12-10T16:00:00Z",
  "localisation": {
    "adresse": "Parcelle 45, Fatick",
    "coordinates": [-16.4167, 14.3333]
  },
  "notes": "Besoin pour labour de 5 hectares"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "reservation": {
      "_id": "...",
      "statut": "en_attente",
      "montantTotal": 120000,
      ...
    }
  }
}
```

### 3. Détails d'une réservation

**GET** `/api/reservations/:id`

### 4. Confirmer une réservation (Prestataire)

**PUT** `/api/reservations/:id/confirm`

**Headers:** `Authorization: Bearer <token>` (rôle: prestataire)

### 5. Annuler une réservation

**PUT** `/api/reservations/:id/cancel`

**Body:**
```json
{
  "raison": "Changement de planning"
}
```

### 6. Démarrer une réservation (Prestataire)

**PUT** `/api/reservations/:id/start`

### 7. Terminer une réservation (Prestataire)

**PUT** `/api/reservations/:id/complete`

---

## Gestion des Paiements

### 1. Initier un paiement (Producteur)

**POST** `/api/payments/initiate`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "reservationId": "reservation_id",
  "methodePaiement": "paytech"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "payment": {...},
    "paymentUrl": "https://paytech.sn/payment/..."
  }
}
```

### 2. Vérifier le statut d'un paiement

**GET** `/api/payments/:id/status`

### 3. Historique des paiements

**GET** `/api/payments`

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `statut` (optionnel)
- `page`, `limit`

### 4. Webhook PayTech (Automatique)

**POST** `/api/payments/webhook/paytech`

*Cette route est appelée automatiquement par PayTech*

---

## Gestion des Avis

### 1. Créer un avis (Producteur)

**POST** `/api/avis`

**Headers:** `Authorization: Bearer <token>` (rôle: producteur)

**Body:**
```json
{
  "reservationId": "reservation_id",
  "note": 5,
  "commentaire": "Excellent service, matériel en parfait état",
  "typeAvis": "machine"
}
```

### 2. Liste des avis d'une machine

**GET** `/api/avis/machine/:machineId`

**Query Params:**
- `page`, `limit`

### 3. Liste des avis d'un prestataire

**GET** `/api/avis/prestataire/:prestataireId`

**Query Params:**
- `page`, `limit`

### 4. Répondre à un avis (Prestataire)

**POST** `/api/avis/:id/reponse`

**Body:**
```json
{
  "reponse": "Merci pour votre retour positif !"
}
```

### 5. Signaler un avis

**POST** `/api/avis/:id/signaler`

**Body:**
```json
{
  "raison": "Contenu inapproprié"
}
```

---

## Recherche

### 1. Recherche globale

**GET** `/api/recherche`

**Query Params:**
- `q`: Terme de recherche
- `type`: machine | prestataire | service
- `page`, `limit`

**Exemple:** `/api/recherche?q=tracteur&type=machine`

### 2. Recherche par localisation

**GET** `/api/recherche/localisation`

**Query Params:**
- `latitude`, `longitude`
- `rayon` (en km, défaut: 50)
- `type` (optionnel)

**Exemple:** `/api/recherche/localisation?latitude=14.7934&longitude=-16.9331&rayon=30`

### 3. Filtres avancés

**GET** `/api/recherche/filtres`

**Query Params:**
- `type`
- `prixMin`, `prixMax`
- `noteMin`
- `disponible`
- `ville`

---

## Notifications

### 1. Liste des notifications

**GET** `/api/notifications`

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `lue` (optionnel): true | false
- `page`, `limit`

### 2. Marquer comme lue

**PUT** `/api/notifications/:id/read`

### 3. Marquer toutes comme lues

**PUT** `/api/notifications/read-all`

### 4. Supprimer une notification

**DELETE** `/api/notifications/:id`

### 5. Nombre de notifications non lues

**GET** `/api/notifications/unread-count`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## Historique

### 1. Historique des réservations

**GET** `/api/historique/reservations`

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `dateDebut`, `dateFin`
- `page`, `limit`

### 2. Historique des paiements

**GET** `/api/historique/payments`

**Query Params:**
- `dateDebut`, `dateFin`
- `page`, `limit`

### 3. Activités récentes

**GET** `/api/historique/activites`

**Query Params:**
- `limit` (défaut: 20)

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200  | Succès |
| 201  | Créé |
| 400  | Requête invalide |
| 401  | Non authentifié |
| 403  | Accès refusé |
| 404  | Ressource non trouvée |
| 409  | Conflit (ex: réservation déjà existante) |
| 500  | Erreur serveur |

---

## Pagination

Toutes les routes paginées retournent:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

---

## Webhooks

### PayTech Webhook

**URL:** `/api/payments/webhook/paytech`

**Méthode:** POST

**Body (envoyé par PayTech):**
```json
{
  "type_event": "sale_complete",
  "custom_field": "payment_id",
  ...
}
```

---

## Variables d'environnement requises

```env
# Serveur
PORT=3000
NODE_ENV=production

# Base de données
MONGODB_URI=mongodb://localhost:27017/allotracteur

# JWT
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=7d

# PayTech
PAYTECH_API_KEY=votre_cle_api
PAYTECH_API_SECRET=votre_secret_api

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email
EMAIL_PASSWORD=votre_mot_de_passe

# SMS
SMS_API_KEY=votre_cle_sms
SMS_SENDER=ALLOTRACTEUR

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud
CLOUDINARY_API_KEY=votre_cle
CLOUDINARY_API_SECRET=votre_secret
```

---

## Support

Pour toute question ou assistance:
- Email: support@allotracteur.sn
- Téléphone: +221 33 XXX XX XX

---

**Fin de la documentation**
