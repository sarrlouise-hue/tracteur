# 📡 API ALLOTRACTEUR - DOCUMENTATION COMPLÈTE

**Base URL**: `http://localhost:4000/api`
**Version**: 2.0.0
**Mode**: Production
**Langues supportées**: Français (fr), Wolof (wo), English (en)

---

## 🌍 INTERNATIONALISATION (i18n)

L'API supporte 3 langues: Français, Wolof et Anglais.

**Méthodes pour définir la langue**:

1. **Header HTTP**: `Accept-Language: wo`
2. **Query parameter**: `?lang=en`
3. **Body**: `{ "lang": "fr" }`

**Exemples**:
```bash
GET /api/machines?lang=wo
Accept-Language: en

curl -H "Accept-Language: wo" http://localhost:4000/api/machines
```

---

## 📚 RÉSUMÉ ENDPOINTS

**Total: 65+ endpoints**

- Authentification: 12
- Admin: 9
- Utilisateurs: 6 (nouveau)
- Notifications: 7 (nouveau)
- Historique: 5 (nouveau)
- Recherche: 3
- Machines: 5
- Réservations: 4
- Paiements: 3
- Avis: 3
- Services: 3
- Prestataires: 3
- Disponibilité: 4 (nouveau)

---

## 👤 UTILISATEURS (6 endpoints)

### 1. GET /users/profile
**Mon profil** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
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
      "profilePicture": { "url": "...", "publicId": "..." }
    },
    "totalReservations": 5,
    "totalPaiements": 3
  }
}
```

---

### 2. PUT /users/profile
**Modifier profil** (Authentifié)

Headers: `Authorization: Bearer <token>`

Body:
```json
{
  "nom": "Diallo",
  "prenom": "Amadou",
  "bio": "Producteur d'arachides à Thiès",
  "siteWeb": "https://example.com"
}
```

Response 200:
```json
{
  "success": true,
  "message": "Profil mis à jour",
  "data": { "user": {...} }
}
```

---

### 3. POST /users/profile/picture
**Upload photo profil** (Authentifié)

Headers: `Authorization: Bearer <token>`
Content-Type: `multipart/form-data`

Body:
```
image: [file]
```

Response 200:
```json
{
  "success": true,
  "message": "Photo de profil mise à jour",
  "data": { "user": {...} }
}
```

---

### 4. DELETE /users/profile/picture
**Supprimer photo profil** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "message": "Photo de profil supprimée"
}
```

---

### 5. GET /users/dashboard
**Tableau de bord** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200 (Prestataire):
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

Response 200 (Producteur):
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

### 6. GET /users/public/:id
**Profil public utilisateur**

Response 200:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "nom": "Sow",
      "prenom": "Moussa",
      "role": "prestataire",
      "entreprise": "AgriService Thiès",
      "bio": "...",
      "machines": [...]
    }
  }
}
```

---

## 🔔 NOTIFICATIONS (7 endpoints)

### 1. GET /notifications/me
**Mes notifications** (Authentifié)

Headers: `Authorization: Bearer <token>`

Query: `?lue=false&limit=20&skip=0`

Response 200:
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

### 2. GET /notifications/me/stats
**Statistiques notifications** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "data": {
    "total": 25,
    "lues": 20,
    "nonLues": 5,
    "parType": [
      { "_id": "reservation", "count": 10 },
      { "_id": "payment", "count": 8 },
      { "_id": "avis", "count": 7 }
    ]
  }
}
```

---

### 3. PUT /notifications/:id/read
**Marquer comme lue** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "message": "Notification marquée comme lue"
}
```

---

### 4. PUT /notifications/read-all
**Tout marquer comme lu** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "message": "Toutes les notifications marquées comme lues"
}
```

---

### 5. DELETE /notifications/:id
**Supprimer notification** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "message": "Notification supprimée"
}
```

---

### 6. DELETE /notifications/read/all
**Supprimer toutes les lues** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "message": "12 notifications supprimées"
}
```

---

### 7. POST /notifications
**Créer notification** (Admin)

Headers: `Authorization: Bearer <admin_token>`

Body:
```json
{
  "destinataireId": "64abc...",
  "titre": "Maintenance programmée",
  "message": "Le système sera en maintenance demain",
  "type": "system"
}
```

---

## 📜 HISTORIQUE (5 endpoints)

### 1. GET /historique/me
**Mon historique** (Authentifié)

Headers: `Authorization: Bearer <token>`

Query: `?type=reservation_created&limit=50&skip=0`

Response 200:
```json
{
  "success": true,
  "data": {
    "historique": [
      {
        "_id": "...",
        "type": "reservation_created",
        "description": "Réservation créée pour Tracteur John Deere",
        "reservationId": {...},
        "machineId": {...},
        "createdAt": "2024-02-01T10:00:00Z"
      }
    ],
    "total": 25,
    "page": 1
  }
}
```

**Types d'historique**:
- `reservation_created`
- `reservation_confirmed`
- `payment_completed`
- `machine_created`
- `avis_created`

---

### 2. GET /historique/me/stats
**Statistiques historique** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "data": {
    "stats": [
      { "_id": "reservation_created", "count": 5 },
      { "_id": "payment_completed", "count": 3 }
    ],
    "totalReservations": 5,
    "totalPayments": 3
  }
}
```

---

### 3. GET /historique/:id
**Détails entrée historique** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "data": {
    "historique": {
      "_id": "...",
      "type": "payment_completed",
      "description": "Paiement de 200000 FCFA confirmé",
      "utilisateurId": {...},
      "paiementId": {...},
      "reservationId": {...}
    }
  }
}
```

---

### 4. DELETE /historique/:id
**Supprimer entrée** (Authentifié)

Headers: `Authorization: Bearer <token>`

Response 200:
```json
{
  "success": true,
  "message": "Entrée historique supprimée"
}
```

---

### 5. GET /historique
**Tout l'historique** (Admin)

Headers: `Authorization: Bearer <admin_token>`

Query: `?type=reservation&userId=64abc...&limit=100`

Response 200:
```json
{
  "success": true,
  "data": {
    "historique": [...],
    "total": 150,
    "page": 1
  }
}
```

---

## 🎯 DISPONIBILITÉ MACHINES (4 nouveaux endpoints)

### 1. POST /machines/:id/check-availability
**Vérifier disponibilité**

Body:
```json
{
  "dateDebut": "2024-02-10",
  "dateFin": "2024-02-15"
}
```

Response 200:
```json
{
  "success": true,
  "data": {
    "available": true,
    "message": "Machine disponible pour ces dates"
  }
}
```

Response 200 (Non disponible):
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
        "dateFin": "2024-02-14",
        "statut": "confirmee"
      }
    ]
  }
}
```

---

### 2. GET /machines/:id/available-dates
**Périodes disponibles**

Query: `?startDate=2024-02-01&endDate=2024-03-01`

Response 200:
```json
{
  "success": true,
  "data": {
    "availablePeriods": [
      {
        "start": "2024-02-01",
        "end": "2024-02-10"
      },
      {
        "start": "2024-02-16",
        "end": "2024-03-01"
      }
    ],
    "unavailablePeriods": [
      {
        "start": "2024-02-10",
        "end": "2024-02-15"
      }
    ]
  }
}
```

---

### 3. POST /machines/:id/calculate-price
**Calculer prix location**

Body:
```json
{
  "dateDebut": "2024-02-01",
  "dateFin": "2024-02-10"
}
```

Response 200:
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

### 4. GET /machines/:id/suggested-dates
**Dates suggérées**

Query: `?durationDays=5&limit=10`

Response 200:
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
      },
      {
        "dateDebut": "2024-02-16",
        "dateFin": "2024-02-21",
        "days": 5,
        "price": 250000,
        "discount": 0
      }
    ]
  }
}
```

---

## 💳 PAIEMENTS PAYTECH (Amélioré)

### POST /payments/initiate
**Initier paiement avec redirection**

Headers: `Authorization: Bearer <token>`

Body:
```json
{
  "reservationId": "64ghi789...",
  "montant": 200000,
  "moyen": "wave",
  "telephone": "221771234567"
}
```

Response 201:
```json
{
  "success": true,
  "message": "Paiement initié avec succès",
  "data": {
    "payment": {
      "_id": "...",
      "reference": "AT-1638976543210-4567",
      "montant": 200000,
      "statut": "pending"
    },
    "redirectUrl": "https://paytech.sn/payment/AT-1638976543210-4567",
    "reference": "AT-1638976543210-4567",
    "token": "eyJhbGc..."
  }
}
```

**Instructions**:
1. Frontend reçoit `redirectUrl`
2. Rediriger utilisateur vers `redirectUrl` (page PayTech)
3. Utilisateur effectue paiement mobile
4. PayTech appelle webhook automatiquement
5. Utilisateur redirigé vers `PAYTECH_SUCCESS_URL` ou `PAYTECH_CANCEL_URL`

**URLs de redirection** (dans .env):
```env
PAYTECH_SUCCESS_URL=http://localhost:5173/payment-success
PAYTECH_CANCEL_URL=http://localhost:5173/payment-cancel
PAYTECH_IPN_URL=https://your-domain.com/api/payments/webhook
```

---

## 📝 RÉSUMÉ COMPLET

### Nouveautés v2.0

✅ **Système i18n** - 3 langues (FR, WO, EN)
✅ **Notifications push** - 7 endpoints
✅ **Historique utilisateur** - 5 endpoints
✅ **Profil utilisateur avancé** - 6 endpoints
✅ **Dashboard prestataire/producteur** - Stats en temps réel
✅ **Gestion images avancée** - Upload multiple, optimisation
✅ **Validation disponibilité** - 4 endpoints smart
✅ **Calcul prix automatique** - Remises progressives
✅ **Tests unitaires** - Jest + Supertest
✅ **PayTech amélioré** - Redirections complètes

### Endpoints Total: 65+

- Authentification: 12
- Admin: 9
- Utilisateurs: 6 ✨
- Notifications: 7 ✨
- Historique: 5 ✨
- Recherche: 3
- Machines: 9 (5 + 4 disponibilité)
- Réservations: 4
- Paiements: 3
- Avis: 3
- Services: 3
- Prestataires: 3

### Lignes de code
- **~7000 lignes** JavaScript
- **68 fichiers** sources
- **12 routes** API
- **Tests** unitaires + intégration

---

## 🧪 COMPTE TEST

### Admin
- Tél: **221770000000**
- Email: admin@allotracteur.sn
- MDP: **password123**

### Producteur
- Tél: **221771234567**
- Email: amadou.diallo@allotracteur.sn
- MDP: **password123**

### Prestataire
- Tél: **221773456789**
- Email: moussa.sow@allotracteur.sn
- MDP: **password123**

---

**Backend ALLOTRACTEUR v2.0** 🇸🇳 🚜
**Version**: 2.0.0 Production Ready
**Date**: Décembre 2024
