# 📡 ALLOTRACTEUR API - GUIDE POSTMAN COMPLET

**Base URL**: `http://localhost:4000/api`
**Version**: 2.0.0
**Total Endpoints**: 65+

---

## 🔑 AUTHENTIFICATION

Tous les endpoints protégés nécessitent un token JWT dans le header:
```
Authorization: Bearer <votre_token>
```

---

## 📋 INDEX DES ENDPOINTS

| Catégorie | Nombre | Public | Authentifié | Admin |
|-----------|--------|--------|-------------|-------|
| [01 - AUTHENTIFICATION](#01---authentification) | 12 | ✅ | - | - |
| [02 - ADMIN](#02---admin) | 9 | - | - | ✅ |
| [03 - UTILISATEURS](#03---utilisateurs) | 6 | 1 | 5 | - |
| [04 - NOTIFICATIONS](#04---notifications) | 7 | - | 6 | 1 |
| [05 - HISTORIQUE](#05---historique) | 5 | - | 4 | 1 |
| [06 - MACHINES](#06---machines) | 9 | 4 | 5 | - |
| [07 - RÉSERVATIONS](#07---réservations) | 4 | - | 4 | - |
| [08 - PAIEMENTS](#08---paiements) | 4 | 1 | 3 | - |
| [09 - AVIS](#09---avis) | 3 | 1 | 2 | - |
| [10 - RECHERCHE](#10---recherche) | 3 | 3 | - | - |
| [11 - SERVICES](#11---services) | 3 | 2 | 1 | - |
| [12 - PRESTATAIRES](#12---prestataires) | 3 | 2 | 1 | - |
| **TOTAL** | **65+** | **14** | **31** | **11** |

---

## 01 - AUTHENTIFICATION

### 1.1 POST `/auth/register`
**Inscription utilisateur**

**Body**:
```json
{
  "nom": "Diallo",
  "prenom": "Amadou",
  "telephone": "221771234567",
  "email": "amadou@allotracteur.sn",
  "motDePasse": "password123",
  "role": "producteur"
}
```

**Response 201**:
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "_id": "64abc...",
      "nom": "Diallo",
      "prenom": "Amadou",
      "role": "producteur"
    }
  }
}
```

---

### 1.2 POST `/auth/login`
**Connexion**

**Body**:
```json
{
  "telephone": "221770000000",
  "motDePasse": "password123"
}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚡ Postman Script** (sauvegarde auto du token):
```javascript
var jsonData = pm.response.json();
if (jsonData.data && jsonData.data.token) {
    pm.collectionVariables.set('token', jsonData.data.token);
}
```

---

### 1.3 POST `/auth/request-otp`
**Demander code OTP**

**Body**:
```json
{
  "telephone": "221771234567"
}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Code OTP envoyé par email"
}
```

---

### 1.4 POST `/auth/verify-otp`
**Vérifier code OTP**

**Body**:
```json
{
  "telephone": "221771234567",
  "otp": "123456"
}
```

---

### 1.5 POST `/auth/reset-password-request`
**Demander réinitialisation mot de passe**

**Body**:
```json
{
  "email": "amadou@allotracteur.sn"
}
```

---

### 1.6 POST `/auth/reset-password`
**Réinitialiser mot de passe**

**Body**:
```json
{
  "email": "amadou@allotracteur.sn",
  "otp": "123456",
  "nouveauMotDePasse": "newpassword123"
}
```

---

### 1.7 PUT `/auth/change-password`
**Changer mot de passe** 🔒 Authentifié

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "ancienMotDePasse": "password123",
  "nouveauMotDePasse": "newpassword456"
}
```

---

### 1.8 POST `/auth/logout`
**Déconnexion** 🔒 Authentifié

**Headers**: `Authorization: Bearer <token>`

---

## 02 - ADMIN

### 2.1 GET `/admin/statistics`
**Dashboard Admin Complet** 🔒 Admin

**Headers**: `Authorization: Bearer <admin_token>`

**Response 200**:
```json
{
  "success": true,
  "data": {
    "utilisateurs": {
      "total": 50,
      "producteurs": 30,
      "prestataires": 18,
      "admins": 2,
      "actifs": 45,
      "inactifs": 5
    },
    "machines": {
      "total": 25,
      "disponibles": 18,
      "indisponibles": 7,
      "parType": [
        {"_id": "tracteur", "count": 15, "disponibles": 12},
        {"_id": "moissonneuse", "count": 8, "disponibles": 5}
      ]
    },
    "reservations": {
      "total": 100,
      "confirmees": 60,
      "enAttente": 20,
      "enCours": 10,
      "terminees": 8,
      "annulees": 2
    },
    "paiements": {
      "total": 80,
      "valides": 70,
      "pending": 8,
      "echoues": 2,
      "revenuTotal": 15000000,
      "revenuParMois": [
        {"_id": {"year": 2024, "month": 11}, "total": 3000000, "count": 15},
        {"_id": {"year": 2024, "month": 12}, "total": 5000000, "count": 25}
      ]
    },
    "avis": {
      "total": 45,
      "moyenneGlobale": 4.5
    },
    "notifications": {
      "total": 250,
      "nonLues": 80
    },
    "activiteRecente": {
      "dernieresReservations": [...],
      "derniersPaiements": [...],
      "derniersUtilisateurs": [...]
    }
  }
}
```

---

### 2.2 GET `/admin/users`
**Liste tous les utilisateurs** 🔒 Admin

**Query Params**:
- `role`: producteur | prestataire | admin
- `isActive`: true | false
- `page`: 1
- `limit`: 50

**URL**: `GET /admin/users?role=producteur&page=1&limit=50`

**Response 200**:
```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 30,
    "page": 1,
    "limit": 50,
    "pages": 1
  }
}
```

---

### 2.3 GET `/admin/users/:id`
**Détails utilisateur** 🔒 Admin

**URL**: `GET /admin/users/64abc...`

---

### 2.4 PUT `/admin/users/:id/role`
**Changer rôle utilisateur** 🔒 Admin

**Body**:
```json
{
  "role": "prestataire"
}
```

**Rôles possibles**: `producteur`, `prestataire`, `admin`

---

### 2.5 PUT `/admin/users/:id/status`
**Activer/Désactiver utilisateur** 🔒 Admin

**Body**:
```json
{
  "isActive": false
}
```

---

### 2.6 DELETE `/admin/users/:id`
**Supprimer utilisateur** 🔒 Admin

**URL**: `DELETE /admin/users/64abc...`

**Note**: Impossible de supprimer son propre compte

---

### 2.7 GET `/admin/machines`
**Toutes les machines** 🔒 Admin

**Query Params**: `disponible`, `type`, `page`, `limit`

**URL**: `GET /admin/machines?page=1&limit=50`

---

### 2.8 GET `/admin/reservations`
**Toutes les réservations** 🔒 Admin

**Query Params**: `statut`, `page`, `limit`

**URL**: `GET /admin/reservations?statut=confirmee&page=1&limit=50`

---

### 2.9 GET `/admin/payments`
**Tous les paiements** 🔒 Admin

**Query Params**: `statut`, `page`, `limit`

**URL**: `GET /admin/payments?statut=valide&page=1&limit=50`

---

## 03 - UTILISATEURS

### 3.1 GET `/users/profile`
**Mon profil** 🔒 Authentifié

**Headers**: `Authorization: Bearer <token>`

**Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "nom": "Diallo",
      "prenom": "Amadou",
      "email": "amadou@allotracteur.sn",
      "role": "producteur",
      "profilePicture": {
        "url": "https://...",
        "publicId": "..."
      }
    },
    "totalReservations": 5,
    "totalPaiements": 3
  }
}
```

---

### 3.2 PUT `/users/profile`
**Modifier profil** 🔒 Authentifié

**Body**:
```json
{
  "nom": "Diallo",
  "prenom": "Amadou",
  "bio": "Producteur d'arachides à Thiès",
  "entreprise": "AgriDiallo",
  "siteWeb": "https://example.com",
  "reseauxSociaux": {
    "facebook": "...",
    "twitter": "..."
  }
}
```

---

### 3.3 POST `/users/profile/picture`
**Upload photo profil** 🔒 Authentifié

**Content-Type**: `multipart/form-data`

**Form Data**:
- `image`: [fichier image]

**Dans Postman**:
1. Onglet "Body"
2. Sélectionner "form-data"
3. Key: `image`, Type: `File`
4. Choisir l'image

---

### 3.4 DELETE `/users/profile/picture`
**Supprimer photo profil** 🔒 Authentifié

---

### 3.5 GET `/users/dashboard`
**Dashboard Utilisateur** 🔒 Authentifié

**Response 200 (Prestataire)**:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "prestataire": {
      "totalMachines": 8,
      "machinesDisponibles": 6,
      "totalReservations": 15,
      "revenuTotal": 1500000,
      "dernieresReservations": [...]
    }
  }
}
```

**Response 200 (Producteur)**:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "producteur": {
      "totalReservations": 5,
      "reservationsActives": 2,
      "totalDepenses": 250000,
      "dernieresReservations": [...],
      "derniersPaiements": [...]
    }
  }
}
```

---

### 3.6 GET `/users/public/:id`
**Profil public** Public

**URL**: `GET /users/public/64abc...`

---

## 04 - NOTIFICATIONS

### 4.1 GET `/notifications/me`
**Mes notifications** 🔒 Authentifié

**Query Params**:
- `lue`: true | false
- `limit`: 20
- `skip`: 0

**URL**: `GET /notifications/me?lue=false&limit=20`

**Response 200**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "...",
        "titre": "Nouvelle réservation",
        "message": "Amadou Diallo a réservé votre machine",
        "type": "reservation",
        "lue": false,
        "lien": "/reservations/123",
        "createdAt": "2024-02-01T10:00:00Z"
      }
    ],
    "total": 15,
    "nonLues": 5
  }
}
```

---

### 4.2 GET `/notifications/me/stats`
**Statistiques notifications** 🔒 Authentifié

**Response 200**:
```json
{
  "success": true,
  "data": {
    "total": 25,
    "lues": 20,
    "nonLues": 5,
    "parType": [
      {"_id": "reservation", "count": 10},
      {"_id": "payment", "count": 8}
    ]
  }
}
```

---

### 4.3 PUT `/notifications/:id/read`
**Marquer comme lue** 🔒 Authentifié

**URL**: `PUT /notifications/64abc.../read`

---

### 4.4 PUT `/notifications/read-all`
**Tout marquer comme lu** 🔒 Authentifié

---

### 4.5 DELETE `/notifications/:id`
**Supprimer notification** 🔒 Authentifié

---

### 4.6 DELETE `/notifications/read/all`
**Supprimer toutes les lues** 🔒 Authentifié

---

### 4.7 POST `/notifications`
**Créer notification** 🔒 Admin

**Body**:
```json
{
  "destinataireId": "64abc...",
  "titre": "Maintenance",
  "message": "Le système sera en maintenance demain",
  "type": "system",
  "lien": "/maintenance"
}
```

---

## 05 - HISTORIQUE

### 5.1 GET `/historique/me`
**Mon historique** 🔒 Authentifié

**Query Params**:
- `type`: reservation_created | payment_completed | etc.
- `limit`: 50
- `skip`: 0

**URL**: `GET /historique/me?type=reservation_created&limit=50`

**Types disponibles**:
- `reservation_created`
- `reservation_confirmed`
- `payment_completed`
- `machine_created`
- `avis_created`

---

### 5.2 GET `/historique/me/stats`
**Statistiques historique** 🔒 Authentifié

---

### 5.3 GET `/historique/:id`
**Détails entrée historique** 🔒 Authentifié

---

### 5.4 DELETE `/historique/:id`
**Supprimer entrée** 🔒 Authentifié

---

### 5.5 GET `/historique`
**Tout l'historique** 🔒 Admin

**Query Params**: `type`, `userId`, `limit`

---

## 06 - MACHINES

### 6.1 GET `/machines`
**Liste machines** Public

**Query Params**:
- `type`: tracteur | moissonneuse | etc.
- `disponible`: true | false
- `limit`: 20
- `skip`: 0

**URL**: `GET /machines?type=tracteur&disponible=true&limit=20`

---

### 6.2 GET `/machines/:id`
**Détails machine** Public

---

### 6.3 POST `/machines`
**Créer machine** 🔒 Authentifié (Prestataire)

**Body**:
```json
{
  "nom": "Tracteur John Deere 5075E",
  "type": "tracteur",
  "marque": "John Deere",
  "modele": "5075E",
  "annee": 2020,
  "description": "Tracteur performant pour tous travaux agricoles",
  "prixParJour": 50000,
  "disponible": true,
  "caracteristiques": {
    "puissance": "75 CV",
    "poids": "3500 kg"
  }
}
```

---

### 6.4 PUT `/machines/:id`
**Modifier machine** 🔒 Authentifié (Propriétaire)

**Body**:
```json
{
  "prixParJour": 55000,
  "disponible": false
}
```

---

### 6.5 DELETE `/machines/:id`
**Supprimer machine** 🔒 Authentifié (Propriétaire)

---

### 6.6 POST `/machines/:id/check-availability`
**Vérifier disponibilité** Public

**Body**:
```json
{
  "dateDebut": "2024-02-10",
  "dateFin": "2024-02-15"
}
```

**Response 200 (Disponible)**:
```json
{
  "success": true,
  "data": {
    "available": true,
    "message": "Machine disponible pour ces dates"
  }
}
```

**Response 200 (Indisponible)**:
```json
{
  "success": true,
  "data": {
    "available": false,
    "reason": "Machine déjà réservée pour ces dates",
    "conflictingReservations": [
      {
        "id": "...",
        "dateDebut": "2024-02-12",
        "dateFin": "2024-02-14"
      }
    ]
  }
}
```

---

### 6.7 GET `/machines/:id/available-dates`
**Périodes disponibles** Public

**Query Params**:
- `startDate`: 2024-02-01
- `endDate`: 2024-03-01

**Response 200**:
```json
{
  "success": true,
  "data": {
    "availablePeriods": [
      {"start": "2024-02-01", "end": "2024-02-10"},
      {"start": "2024-02-16", "end": "2024-03-01"}
    ],
    "unavailablePeriods": [
      {"start": "2024-02-10", "end": "2024-02-15"}
    ]
  }
}
```

---

### 6.8 POST `/machines/:id/calculate-price`
**Calculer prix** Public

**Body**:
```json
{
  "dateDebut": "2024-02-01",
  "dateFin": "2024-02-10"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "days": 9,
    "pricePerDay": 50000,
    "basePrice": 450000,
    "discount": 10,
    "discountAmount": 45000,
    "finalPrice": 405000
  }
}
```

**Remises**:
- 7-13 jours: 10%
- 14-29 jours: 15%
- 30+ jours: 20%

---

### 6.9 GET `/machines/:id/suggested-dates`
**Dates suggérées** Public

**Query Params**:
- `durationDays`: 5
- `limit`: 10

**Response 200**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "dateDebut": "2024-02-03",
        "dateFin": "2024-02-08",
        "days": 5,
        "price": 250000,
        "discount": 0
      }
    ]
  }
}
```

---

## 07 - RÉSERVATIONS

### 7.1 POST `/reservations`
**Créer réservation** 🔒 Authentifié

**Body**:
```json
{
  "machineId": "64abc...",
  "dateDebut": "2024-02-10",
  "dateFin": "2024-02-15",
  "adresseLivraison": "Thiès, Sénégal",
  "notes": "Besoin de livraison urgente"
}
```

---

### 7.2 GET `/reservations/me`
**Mes réservations** 🔒 Authentifié

**Query Params**: `limit`, `skip`, `statut`

---

### 7.3 GET `/reservations/:id`
**Détails réservation** 🔒 Authentifié

---

### 7.4 PUT `/reservations/:id/cancel`
**Annuler réservation** 🔒 Authentifié

---

## 08 - PAIEMENTS

### 8.1 POST `/payments/initiate`
**Initier paiement PayTech** 🔒 Authentifié

**Body**:
```json
{
  "reservationId": "64ghi...",
  "montant": 200000,
  "moyen": "wave",
  "telephone": "221771234567"
}
```

**Moyens disponibles**: `wave`, `orange_money`, `free_money`

**Response 201**:
```json
{
  "success": true,
  "message": "Paiement initié avec succès",
  "data": {
    "payment": {...},
    "redirectUrl": "https://paytech.sn/payment/AT-...",
    "reference": "AT-1638976543210-4567",
    "token": "eyJ..."
  }
}
```

**Instructions**:
1. Frontend reçoit `redirectUrl`
2. Rediriger utilisateur vers `redirectUrl`
3. Utilisateur paie sur PayTech
4. PayTech appelle webhook
5. Redirection vers SUCCESS_URL ou CANCEL_URL

---

### 8.2 GET `/payments/me`
**Mes paiements** 🔒 Authentifié

---

### 8.3 GET `/payments/:id`
**Détails paiement** 🔒 Authentifié

---

### 8.4 POST `/payments/webhook`
**Webhook PayTech** Public (appelé par PayTech)

**Body** (exemple):
```json
{
  "ref_command": "AT-1638976543210-4567",
  "status": 1,
  "transaction_id": "PAYTECH-123456",
  "type_event": "payment_complete",
  "item_price": 200000,
  "payment_method": "wave"
}
```

---

## 09 - AVIS

### 9.1 POST `/avis`
**Créer avis** 🔒 Authentifié

**Body**:
```json
{
  "machineId": "64abc...",
  "reservationId": "64def...",
  "note": 5,
  "commentaire": "Excellent service! Machine en parfait état."
}
```

**Note**: 1 à 5

---

### 9.2 GET `/avis/machine/:machineId`
**Avis d'une machine** Public

**URL**: `GET /avis/machine/64abc...?limit=20`

---

### 9.3 GET `/avis/me`
**Mes avis** 🔒 Authentifié

---

## 10 - RECHERCHE

### 10.1 GET `/recherche/prestataires`
**Rechercher prestataires** Public

**Query Params**:
- `latitude`: 14.7886 (Dakar)
- `longitude`: -16.9318
- `rayon`: 50 (km)
- `limit`: 20

**URL**: `GET /recherche/prestataires?latitude=14.7886&longitude=-16.9318&rayon=50`

---

### 10.2 GET `/recherche/machines`
**Rechercher machines** Public

**Query Params**:
- `type`: tracteur
- `latitude`: 14.7886
- `longitude`: -16.9318
- `rayon`: 50
- `disponible`: true

---

### 10.3 GET `/recherche/services`
**Rechercher services** Public

**Query Params**:
- `categorie`: labour
- `latitude`: 14.7886
- `longitude`: -16.9318

---

## 11 - SERVICES

### 11.1 GET `/services`
**Liste services** Public

---

### 11.2 POST `/services`
**Créer service** 🔒 Authentifié (Prestataire)

**Body**:
```json
{
  "nom": "Labour profond",
  "description": "Service de labour professionnel",
  "categorie": "labour",
  "prixParHectare": 25000
}
```

---

### 11.3 GET `/services/:id`
**Détails service** Public

---

## 12 - PRESTATAIRES

### 12.1 GET `/prestataires`
**Liste prestataires** Public

---

### 12.2 POST `/prestataires`
**Créer profil prestataire** 🔒 Authentifié

**Body**:
```json
{
  "description": "Prestataire de services agricoles",
  "longitude": -16.9318,
  "latitude": 14.7886,
  "adresse": "Thiès, Sénégal",
  "servicesProposes": ["labour", "moisson"]
}
```

---

### 12.3 GET `/prestataires/:id`
**Détails prestataire** Public

---

## 🔧 HEALTH CHECK

### GET `/health`

**URL Complète**: `http://localhost:4000/health`

**Response 200**:
```json
{
  "status": "OK",
  "message": "API ALLOTRACTEUR fonctionnelle",
  "timestamp": "2024-12-05T20:00:00.000Z",
  "uptime": 123.45
}
```

---

## 🌍 SUPPORT MULTILINGUE (i18n)

**3 langues supportées**: Français (fr), Wolof (wo), English (en)

**Méthode 1 - Header**:
```
Accept-Language: wo
```

**Méthode 2 - Query parameter**:
```
GET /api/machines?lang=en
```

**Méthode 3 - Body**:
```json
{
  "lang": "wo",
  "telephone": "221771234567"
}
```

---

## 👑 COMPTES DE TEST

### Admin
- **Tél**: 221770000000
- **Email**: admin@allotracteur.sn
- **MDP**: password123

### Producteur
- **Tél**: 221771234567
- **Email**: amadou.diallo@allotracteur.sn
- **MDP**: password123

### Prestataire
- **Tél**: 221773456789
- **Email**: moussa.sow@allotracteur.sn
- **MDP**: password123

---

## 📌 VARIABLES POSTMAN

Dans Postman, créer ces variables de collection:

| Variable | Valeur | Description |
|----------|--------|-------------|
| `baseUrl` | `http://localhost:4000/api` | Base URL API |
| `token` | (auto) | Token JWT (auto-rempli après login) |

---

## 🚀 IMPORT COLLECTION POSTMAN

1. Ouvrir Postman
2. Cliquer "Import"
3. Sélectionner le fichier `POSTMAN_COLLECTION.json`
4. Collection importée avec 65+ endpoints

**Fonctionnalités**:
- ✅ Auto-sauvegarde token après login
- ✅ Variables globales (baseUrl, token)
- ✅ Tous les endpoints organisés
- ✅ Exemples de body JSON
- ✅ Documentation intégrée

---

**Backend ALLOTRACTEUR v2.0** 🇸🇳 🚜 🌍
**Documentation Postman Complète**
**65+ Endpoints documentés**
