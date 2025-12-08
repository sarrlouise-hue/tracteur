# 📚 DOCUMENTATION API ALLOTRACTEUR

**Base URL Local:** `http://localhost:4000/api`
**Base URL Production:** `https://api.allotracteur.sn/api`

---

## 🔐 01 — AUTHENTIFICATION

### ✔️ 1. INSCRIPTION (REGISTER)

**URL:**
```
POST http://localhost:4000/api/auth/register
```

**BODY (raw / JSON)**
```json
{
  "nom": "Diallo",
  "prenom": "Amadou",
  "telephone": "221770000000",
  "email": "amadou@allotracteur.sn",
  "motDePasse": "password123",
  "role": "producteur"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6745a1b2c3d4e5f6g7h8i9j0",
      "nom": "Diallo",
      "prenom": "Amadou",
      "telephone": "221770000000",
      "email": "amadou@allotracteur.sn",
      "role": "producteur"
    }
  }
}
```

---

### ✔️ 2. CONNEXION (LOGIN)

**URL:**
```
POST http://localhost:4000/api/auth/login
```

**BODY (raw / JSON)**
```json
{
  "email": "amadou@allotracteur.sn",
  "motDePasse": "password123"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6745a1b2c3d4e5f6g7h8i9j0",
      "nom": "Diallo",
      "prenom": "Amadou",
      "email": "amadou@allotracteur.sn",
      "role": "producteur",
      "telephone": "221770000000"
    }
  }
}
```

---

### ✔️ 3. DEMANDER OTP (Mot de passe oublié)

**URL:**
```
POST http://localhost:4000/api/auth/forgot-password
```

**BODY (raw / JSON)**
```json
{
  "telephone": "221770000000"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Code OTP envoyé par SMS",
  "data": {
    "otpSent": true,
    "telephone": "221770000000"
  }
}
```

---

### ✔️ 4. VÉRIFIER OTP

**URL:**
```
POST http://localhost:4000/api/auth/verify-otp
```

**BODY (raw / JSON)**
```json
{
  "telephone": "221770000000",
  "code": "123456"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Code OTP valide",
  "data": {
    "valid": true,
    "resetToken": "temp_token_xyz123"
  }
}
```

---

### ✔️ 5. RÉINITIALISER MOT DE PASSE

**URL:**
```
POST http://localhost:4000/api/auth/reset-password
```

**BODY (raw / JSON)**
```json
{
  "telephone": "221770000000",
  "nouveauMotDePasse": "newPassword456",
  "resetToken": "temp_token_xyz123"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Mot de passe réinitialisé avec succès"
}
```

---

### ✔️ 6. PROFIL UTILISATEUR

**URL:**
```
GET http://localhost:4000/api/auth/me
```

**HEADERS**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "6745a1b2c3d4e5f6g7h8i9j0",
    "nom": "Diallo",
    "prenom": "Amadou",
    "email": "amadou@allotracteur.sn",
    "telephone": "221770000000",
    "role": "producteur",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 👤 02 — UTILISATEURS

### ✔️ 1. OBTENIR MON PROFIL

**URL:**
```
GET http://localhost:4000/api/users/profile
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "6745a1b2c3d4e5f6g7h8i9j0",
    "nom": "Diallo",
    "prenom": "Amadou",
    "email": "amadou@allotracteur.sn",
    "telephone": "221770000000",
    "role": "producteur",
    "adresse": "Dakar, Sénégal",
    "photoProfil": "https://cloudinary.com/image.jpg"
  }
}
```

---

### ✔️ 2. METTRE À JOUR PROFIL

**URL:**
```
PUT http://localhost:4000/api/users/profile
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "nom": "Diallo",
  "prenom": "Amadou",
  "adresse": "Pikine, Dakar",
  "localisation": {
    "type": "Point",
    "coordinates": [-17.4467, 14.7645]
  }
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Profil mis à jour",
  "data": {
    "_id": "6745a1b2c3d4e5f6g7h8i9j0",
    "nom": "Diallo",
    "prenom": "Amadou",
    "adresse": "Pikine, Dakar"
  }
}
```

---

### ✔️ 3. UPLOADER PHOTO DE PROFIL

**URL:**
```
POST http://localhost:4000/api/users/profile/upload
```

**HEADERS**
```
Authorization: Bearer TOKEN
Content-Type: multipart/form-data
```

**BODY (form-data)**
```
photo: [FICHIER IMAGE]
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Photo uploadée avec succès",
  "data": {
    "photoProfil": "https://res.cloudinary.com/allotracteur/image/upload/v1234567890/users/photo.jpg"
  }
}
```

---

### ✔️ 4. TABLEAU DE BORD UTILISATEUR

**URL:**
```
GET http://localhost:4000/api/users/dashboard
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK) - Producteur**
```json
{
  "success": true,
  "data": {
    "role": "producteur",
    "stats": {
      "reservationsEnCours": 3,
      "reservationsTotal": 15,
      "depensesTotal": 450000
    },
    "reservationsRecentes": [
      {
        "_id": "res123",
        "machine": "Tracteur John Deere",
        "dateDebut": "2024-12-10",
        "dateFin": "2024-12-15",
        "statut": "confirmee"
      }
    ]
  }
}
```

---

### ✔️ 5. CHANGER MOT DE PASSE

**URL:**
```
PUT http://localhost:4000/api/users/change-password
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "ancienMotDePasse": "password123",
  "nouveauMotDePasse": "newPassword456"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Mot de passe modifié avec succès"
}
```

---

### ✔️ 6. SUPPRIMER COMPTE

**URL:**
```
DELETE http://localhost:4000/api/users/account
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Compte supprimé avec succès"
}
```

---

## 🚜 03 — MACHINES

### ✔️ 1. LISTER TOUTES LES MACHINES

**URL:**
```
GET http://localhost:4000/api/machines
```

**QUERY PARAMS (optionnels)**
```
?type=Tracteur
&disponibilite=true
&limit=10
&page=1
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "mach123",
      "nom": "Tracteur John Deere 6M",
      "type": "Tracteur",
      "modele": "6M Series",
      "marque": "John Deere",
      "annee": 2020,
      "puissance": "120 CV",
      "prixLocation": 75000,
      "disponibilite": true,
      "images": ["url1.jpg", "url2.jpg"],
      "prestataire": {
        "_id": "prest123",
        "nom": "Fall",
        "prenom": "Ousmane"
      }
    }
  ]
}
```

---

### ✔️ 2. DÉTAILS D'UNE MACHINE

**URL:**
```
GET http://localhost:4000/api/machines/:id
```

**EXEMPLE:**
```
GET http://localhost:4000/api/machines/mach123
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "mach123",
    "nom": "Tracteur John Deere 6M",
    "type": "Tracteur",
    "modele": "6M Series",
    "marque": "John Deere",
    "annee": 2020,
    "puissance": "120 CV",
    "description": "Tracteur polyvalent idéal pour labour et transport",
    "prixLocation": 75000,
    "disponibilite": true,
    "images": [
      "https://cloudinary.com/tracteur1.jpg",
      "https://cloudinary.com/tracteur2.jpg"
    ],
    "localisation": {
      "type": "Point",
      "coordinates": [-17.4467, 14.7645],
      "adresse": "Thiès, Sénégal"
    },
    "prestataire": {
      "_id": "prest123",
      "nom": "Fall",
      "prenom": "Ousmane",
      "telephone": "221771234567",
      "rating": 4.5
    },
    "avis": [
      {
        "note": 5,
        "commentaire": "Excellent tracteur",
        "utilisateur": "Amadou Diallo"
      }
    ]
  }
}
```

---

### ✔️ 3. CRÉER UNE MACHINE (Prestataire uniquement)

**URL:**
```
POST http://localhost:4000/api/machines
```

**HEADERS**
```
Authorization: Bearer TOKEN
Content-Type: multipart/form-data
```

**BODY (form-data)**
```
nom: Tracteur Massey Ferguson
type: Tracteur
modele: MF 5710
marque: Massey Ferguson
annee: 2021
puissance: 110 CV
description: Tracteur robuste pour tous travaux
prixLocation: 65000
disponibilite: true
adresse: Kaolack, Sénégal
latitude: 14.1511
longitude: -16.0763
images: [FICHIERS IMAGES]
```

**RESPONSE (201 CREATED)**
```json
{
  "success": true,
  "message": "Machine créée avec succès",
  "data": {
    "_id": "mach456",
    "nom": "Tracteur Massey Ferguson",
    "type": "Tracteur",
    "prixLocation": 65000,
    "images": ["url1.jpg", "url2.jpg"]
  }
}
```

---

### ✔️ 4. METTRE À JOUR UNE MACHINE

**URL:**
```
PUT http://localhost:4000/api/machines/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "prixLocation": 70000,
  "disponibilite": false,
  "description": "Description mise à jour"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Machine mise à jour",
  "data": {
    "_id": "mach456",
    "prixLocation": 70000,
    "disponibilite": false
  }
}
```

---

### ✔️ 5. SUPPRIMER UNE MACHINE

**URL:**
```
DELETE http://localhost:4000/api/machines/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Machine supprimée avec succès"
}
```

---

### ✔️ 6. MES MACHINES (Prestataire)

**URL:**
```
GET http://localhost:4000/api/machines/my/machines
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "mach123",
      "nom": "Tracteur John Deere",
      "type": "Tracteur",
      "prixLocation": 75000,
      "disponibilite": true,
      "reservationsActives": 2
    }
  ]
}
```

---

## 📅 04 — RÉSERVATIONS

### ✔️ 1. CRÉER UNE RÉSERVATION

**URL:**
```
POST http://localhost:4000/api/reservations
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "machineId": "mach123",
  "dateDebut": "2024-12-15",
  "dateFin": "2024-12-20",
  "adresseLivraison": "Pikine, Dakar",
  "livraisonRequise": true,
  "notes": "Besoin pour labour de 5 hectares"
}
```

**RESPONSE (201 CREATED)**
```json
{
  "success": true,
  "message": "Réservation créée avec succès",
  "data": {
    "_id": "res123",
    "machineId": "mach123",
    "producteurId": "prod123",
    "dateDebut": "2024-12-15T00:00:00.000Z",
    "dateFin": "2024-12-20T00:00:00.000Z",
    "statut": "en_attente",
    "montantTotal": 375000,
    "nombreJours": 5
  }
}
```

---

### ✔️ 2. MES RÉSERVATIONS

**URL:**
```
GET http://localhost:4000/api/reservations/my/reservations
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**QUERY PARAMS (optionnels)**
```
?statut=confirmee
&page=1
&limit=10
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "res123",
      "machine": {
        "nom": "Tracteur John Deere",
        "images": ["url1.jpg"]
      },
      "dateDebut": "2024-12-15",
      "dateFin": "2024-12-20",
      "statut": "confirmee",
      "montantTotal": 375000,
      "prestataire": {
        "nom": "Fall",
        "prenom": "Ousmane",
        "telephone": "221771234567"
      }
    }
  ]
}
```

---

### ✔️ 3. DÉTAILS D'UNE RÉSERVATION

**URL:**
```
GET http://localhost:4000/api/reservations/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "res123",
    "machine": {
      "_id": "mach123",
      "nom": "Tracteur John Deere",
      "type": "Tracteur",
      "images": ["url1.jpg", "url2.jpg"]
    },
    "producteur": {
      "_id": "prod123",
      "nom": "Diallo",
      "prenom": "Amadou",
      "telephone": "221770000000"
    },
    "prestataire": {
      "_id": "prest123",
      "nom": "Fall",
      "prenom": "Ousmane",
      "telephone": "221771234567"
    },
    "dateDebut": "2024-12-15T00:00:00.000Z",
    "dateFin": "2024-12-20T00:00:00.000Z",
    "statut": "confirmee",
    "montantTotal": 375000,
    "nombreJours": 5,
    "livraisonRequise": true,
    "adresseLivraison": "Pikine, Dakar",
    "notes": "Besoin pour labour de 5 hectares"
  }
}
```

---

### ✔️ 4. CONFIRMER RÉSERVATION (Prestataire)

**URL:**
```
PUT http://localhost:4000/api/reservations/:id/confirm
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Réservation confirmée",
  "data": {
    "_id": "res123",
    "statut": "confirmee"
  }
}
```

---

### ✔️ 5. REFUSER RÉSERVATION (Prestataire)

**URL:**
```
PUT http://localhost:4000/api/reservations/:id/reject
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "raisonRefus": "Machine déjà réservée pour cette période"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Réservation refusée",
  "data": {
    "_id": "res123",
    "statut": "refusee",
    "raisonRefus": "Machine déjà réservée pour cette période"
  }
}
```

---

### ✔️ 6. ANNULER RÉSERVATION

**URL:**
```
PUT http://localhost:4000/api/reservations/:id/cancel
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Réservation annulée",
  "data": {
    "_id": "res123",
    "statut": "annulee"
  }
}
```

---

### ✔️ 7. TERMINER RÉSERVATION (Prestataire)

**URL:**
```
PUT http://localhost:4000/api/reservations/:id/complete
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Réservation terminée",
  "data": {
    "_id": "res123",
    "statut": "terminee"
  }
}
```

---

## 💳 05 — PAIEMENTS

### ✔️ 1. INITIER UN PAIEMENT

**URL:**
```
POST http://localhost:4000/api/payments/initiate
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "reservationId": "res123",
  "montant": 375000,
  "methode": "mobile_money"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Paiement initié",
  "data": {
    "paiementId": "pay123",
    "redirectUrl": "https://paytech.sn/pay/abc123def456",
    "montant": 375000,
    "reservation": "res123"
  }
}
```

---

### ✔️ 2. VÉRIFIER STATUT PAIEMENT

**URL:**
```
GET http://localhost:4000/api/payments/:id/status
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "pay123",
    "statut": "valide",
    "montant": 375000,
    "methode": "mobile_money",
    "transactionId": "PAYTECH_TXN_123456",
    "reservationId": "res123"
  }
}
```

---

### ✔️ 3. HISTORIQUE PAIEMENTS

**URL:**
```
GET http://localhost:4000/api/payments/my/payments
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "pay123",
      "montant": 375000,
      "statut": "valide",
      "methode": "mobile_money",
      "reservation": {
        "machine": "Tracteur John Deere",
        "dateDebut": "2024-12-15"
      },
      "createdAt": "2024-12-10T14:30:00.000Z"
    }
  ]
}
```

---

### ✔️ 4. WEBHOOK PAYTECH (Automatique)

**URL:**
```
POST http://localhost:4000/api/payments/webhook
```

**BODY (raw / JSON) - Envoyé par PayTech**
```json
{
  "type_event": "sale_complete",
  "custom_field": "pay123",
  "item_price": "375000",
  "ref_command": "PAYTECH_REF_123",
  "payment_method": "orange_money"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Webhook traité"
}
```

---

## ⭐ 06 — AVIS & ÉVALUATIONS

### ✔️ 1. CRÉER UN AVIS

**URL:**
```
POST http://localhost:4000/api/avis
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "machineId": "mach123",
  "reservationId": "res123",
  "note": 5,
  "commentaire": "Excellent service, tracteur en très bon état"
}
```

**RESPONSE (201 CREATED)**
```json
{
  "success": true,
  "message": "Avis créé avec succès",
  "data": {
    "_id": "avis123",
    "note": 5,
    "commentaire": "Excellent service",
    "utilisateur": "Amadou Diallo"
  }
}
```

---

### ✔️ 2. AVIS D'UNE MACHINE

**URL:**
```
GET http://localhost:4000/api/avis/machine/:machineId
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 8,
  "moyenne": 4.5,
  "data": [
    {
      "_id": "avis123",
      "note": 5,
      "commentaire": "Excellent service",
      "utilisateur": {
        "nom": "Diallo",
        "prenom": "Amadou"
      },
      "createdAt": "2024-12-05T10:00:00.000Z"
    }
  ]
}
```

---

### ✔️ 3. AVIS D'UN PRESTATAIRE

**URL:**
```
GET http://localhost:4000/api/avis/prestataire/:prestataireId
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 15,
  "moyenne": 4.7,
  "data": [
    {
      "_id": "avis456",
      "note": 5,
      "commentaire": "Très professionnel",
      "machine": "Tracteur John Deere",
      "utilisateur": {
        "nom": "Diallo",
        "prenom": "Amadou"
      }
    }
  ]
}
```

---

### ✔️ 4. MES AVIS

**URL:**
```
GET http://localhost:4000/api/avis/my/avis
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "avis123",
      "note": 5,
      "commentaire": "Excellent service",
      "machine": {
        "nom": "Tracteur John Deere"
      },
      "createdAt": "2024-12-05T10:00:00.000Z"
    }
  ]
}
```

---

### ✔️ 5. MODIFIER UN AVIS

**URL:**
```
PUT http://localhost:4000/api/avis/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**BODY (raw / JSON)**
```json
{
  "note": 4,
  "commentaire": "Bon service, quelques retards"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Avis modifié",
  "data": {
    "_id": "avis123",
    "note": 4,
    "commentaire": "Bon service, quelques retards"
  }
}
```

---

### ✔️ 6. SUPPRIMER UN AVIS

**URL:**
```
DELETE http://localhost:4000/api/avis/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Avis supprimé"
}
```

---

## 🔍 07 — RECHERCHE & DISPONIBILITÉ

### ✔️ 1. RECHERCHER MACHINES

**URL:**
```
POST http://localhost:4000/api/search
```

**BODY (raw / JSON)**
```json
{
  "type": "Tracteur",
  "localisation": {
    "latitude": 14.7645,
    "longitude": -17.4467,
    "rayon": 50
  },
  "dateDebut": "2024-12-15",
  "dateFin": "2024-12-20",
  "prixMax": 100000
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "mach123",
      "nom": "Tracteur John Deere",
      "type": "Tracteur",
      "prixLocation": 75000,
      "disponible": true,
      "distance": 12.5,
      "prestataire": {
        "nom": "Fall Ousmane",
        "rating": 4.5
      }
    }
  ]
}
```

---

### ✔️ 2. VÉRIFIER DISPONIBILITÉ

**URL:**
```
POST http://localhost:4000/api/search/availability
```

**BODY (raw / JSON)**
```json
{
  "machineId": "mach123",
  "dateDebut": "2024-12-15",
  "dateFin": "2024-12-20"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "disponible": true,
    "machineId": "mach123",
    "periode": {
      "debut": "2024-12-15",
      "fin": "2024-12-20"
    },
    "prixTotal": 375000,
    "nombreJours": 5
  }
}
```

---

### ✔️ 3. DATES DISPONIBLES

**URL:**
```
GET http://localhost:4000/api/search/available-dates/:machineId
```

**QUERY PARAMS**
```
?mois=12&annee=2024
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "machineId": "mach123",
    "mois": 12,
    "annee": 2024,
    "datesDisponibles": [
      "2024-12-01", "2024-12-02", "2024-12-05",
      "2024-12-10", "2024-12-15", "2024-12-20"
    ],
    "datesReservees": [
      "2024-12-03", "2024-12-04", "2024-12-06"
    ]
  }
}
```

---

### ✔️ 4. CALCULER PRIX

**URL:**
```
POST http://localhost:4000/api/search/calculate-price
```

**BODY (raw / JSON)**
```json
{
  "machineId": "mach123",
  "dateDebut": "2024-12-15",
  "dateFin": "2024-12-20"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "prixJournalier": 75000,
    "nombreJours": 5,
    "sousTotal": 375000,
    "remise": 37500,
    "pourcentageRemise": 10,
    "total": 337500
  }
}
```

---

## 🔔 08 — NOTIFICATIONS

### ✔️ 1. MES NOTIFICATIONS

**URL:**
```
GET http://localhost:4000/api/notifications
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**QUERY PARAMS**
```
?page=1&limit=20&nonLues=true
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 15,
  "nonLues": 5,
  "data": [
    {
      "_id": "notif123",
      "titre": "Nouvelle réservation",
      "message": "Vous avez une nouvelle réservation pour Tracteur John Deere",
      "type": "reservation",
      "lue": false,
      "createdAt": "2024-12-05T14:30:00.000Z"
    }
  ]
}
```

---

### ✔️ 2. MARQUER COMME LUE

**URL:**
```
PUT http://localhost:4000/api/notifications/:id/read
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Notification marquée comme lue"
}
```

---

### ✔️ 3. MARQUER TOUTES COMME LUES

**URL:**
```
PUT http://localhost:4000/api/notifications/read-all
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Toutes les notifications marquées comme lues",
  "count": 15
}
```

---

### ✔️ 4. SUPPRIMER UNE NOTIFICATION

**URL:**
```
DELETE http://localhost:4000/api/notifications/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Notification supprimée"
}
```

---

### ✔️ 5. SUPPRIMER TOUTES LES NOTIFICATIONS

**URL:**
```
DELETE http://localhost:4000/api/notifications/all
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Toutes les notifications supprimées"
}
```

---

## 📜 09 — HISTORIQUE

### ✔️ 1. MON HISTORIQUE

**URL:**
```
GET http://localhost:4000/api/history
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**QUERY PARAMS**
```
?page=1&limit=20&type=reservation
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "hist123",
      "type": "reservation",
      "action": "created",
      "description": "Réservation créée pour Tracteur John Deere",
      "metadata": {
        "reservationId": "res123",
        "montant": 375000
      },
      "createdAt": "2024-12-05T10:00:00.000Z"
    }
  ]
}
```

---

### ✔️ 2. STATISTIQUES UTILISATEUR

**URL:**
```
GET http://localhost:4000/api/history/stats
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "totalReservations": 25,
    "totalDepenses": 1875000,
    "machinesFavorites": [
      {
        "type": "Tracteur",
        "count": 15
      }
    ],
    "activiteParMois": [
      {
        "mois": "Décembre",
        "reservations": 5
      }
    ]
  }
}
```

---

### ✔️ 3. DÉTAILS HISTORIQUE

**URL:**
```
GET http://localhost:4000/api/history/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "hist123",
    "type": "reservation",
    "action": "created",
    "description": "Réservation créée",
    "metadata": {
      "reservationId": "res123",
      "machineNom": "Tracteur John Deere",
      "montant": 375000
    }
  }
}
```

---

### ✔️ 4. SUPPRIMER HISTORIQUE

**URL:**
```
DELETE http://localhost:4000/api/history/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Historique supprimé"
}
```

---

## 👔 10 — PRESTATAIRES

### ✔️ 1. LISTER TOUS LES PRESTATAIRES

**URL:**
```
GET http://localhost:4000/api/prestataires
```

**QUERY PARAMS**
```
?page=1&limit=10&rating=4
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "prest123",
      "nom": "Fall",
      "prenom": "Ousmane",
      "telephone": "221771234567",
      "email": "ousmane@allotracteur.sn",
      "rating": 4.5,
      "nombreMachines": 8,
      "nombreReservations": 45,
      "localisation": {
        "adresse": "Thiès, Sénégal"
      }
    }
  ]
}
```

---

### ✔️ 2. DÉTAILS PRESTATAIRE

**URL:**
```
GET http://localhost:4000/api/prestataires/:id
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "prest123",
    "nom": "Fall",
    "prenom": "Ousmane",
    "telephone": "221771234567",
    "email": "ousmane@allotracteur.sn",
    "rating": 4.5,
    "nombreAvis": 32,
    "machines": [
      {
        "_id": "mach123",
        "nom": "Tracteur John Deere",
        "type": "Tracteur",
        "disponibilite": true
      }
    ],
    "avisRecents": [
      {
        "note": 5,
        "commentaire": "Excellent prestataire"
      }
    ]
  }
}
```

---

### ✔️ 3. MACHINES D'UN PRESTATAIRE

**URL:**
```
GET http://localhost:4000/api/prestataires/:id/machines
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "mach123",
      "nom": "Tracteur John Deere",
      "type": "Tracteur",
      "prixLocation": 75000,
      "disponibilite": true,
      "images": ["url1.jpg"]
    }
  ]
}
```

---

### ✔️ 4. STATISTIQUES PRESTATAIRE

**URL:**
```
GET http://localhost:4000/api/prestataires/:id/stats
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "totalReservations": 45,
    "reservationsEnCours": 3,
    "revenuTotal": 3375000,
    "revenuMoisActuel": 450000,
    "tauxOccupation": 75,
    "machinesActives": 8
  }
}
```

---

## 🛠️ 11 — SERVICES

### ✔️ 1. LISTER TOUS LES SERVICES

**URL:**
```
GET http://localhost:4000/api/services
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "serv123",
      "nom": "Labour",
      "description": "Service de labour de terrain",
      "categorie": "Travail du sol",
      "prixMoyen": 50000,
      "icone": "🚜"
    }
  ]
}
```

---

### ✔️ 2. DÉTAILS SERVICE

**URL:**
```
GET http://localhost:4000/api/services/:id
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "serv123",
    "nom": "Labour",
    "description": "Service de labour de terrain",
    "categorie": "Travail du sol",
    "prixMoyen": 50000,
    "machinesCompatibles": [
      {
        "type": "Tracteur",
        "count": 25
      }
    ]
  }
}
```

---

## 👨‍💼 12 — ADMINISTRATION

### ✔️ 1. STATISTIQUES GLOBALES (Admin uniquement)

**URL:**
```
GET http://localhost:4000/api/admin/stats
```

**HEADERS**
```
Authorization: Bearer TOKEN_ADMIN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "data": {
    "utilisateurs": {
      "total": 250,
      "producteurs": 180,
      "prestataires": 70
    },
    "machines": {
      "total": 125,
      "disponibles": 98,
      "parType": {
        "Tracteur": 80,
        "Moissonneuse": 25,
        "Charrue": 20
      }
    },
    "reservations": {
      "total": 450,
      "enCours": 25,
      "terminees": 380
    },
    "paiements": {
      "revenuTotal": 33750000,
      "revenuMois": 4500000,
      "nombreTransactions": 450
    },
    "revenuParMois": [
      {
        "mois": "Janvier",
        "montant": 2500000
      }
    ],
    "activiteRecente": {
      "reservations": [...],
      "paiements": [...],
      "nouveauxUtilisateurs": [...]
    }
  }
}
```

---

### ✔️ 2. LISTER TOUS LES UTILISATEURS

**URL:**
```
GET http://localhost:4000/api/admin/users
```

**HEADERS**
```
Authorization: Bearer TOKEN_ADMIN
```

**QUERY PARAMS**
```
?role=producteur&page=1&limit=20
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "count": 250,
  "data": [
    {
      "_id": "user123",
      "nom": "Diallo",
      "prenom": "Amadou",
      "email": "amadou@allotracteur.sn",
      "role": "producteur",
      "telephone": "221770000000",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### ✔️ 3. BLOQUER/DÉBLOQUER UTILISATEUR

**URL:**
```
PUT http://localhost:4000/api/admin/users/:id/toggle-status
```

**HEADERS**
```
Authorization: Bearer TOKEN_ADMIN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Statut utilisateur modifié",
  "data": {
    "_id": "user123",
    "actif": false
  }
}
```

---

### ✔️ 4. SUPPRIMER UTILISATEUR

**URL:**
```
DELETE http://localhost:4000/api/admin/users/:id
```

**HEADERS**
```
Authorization: Bearer TOKEN_ADMIN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Utilisateur supprimé"
}
```

---

### ✔️ 5. VALIDER MACHINE (Admin)

**URL:**
```
PUT http://localhost:4000/api/admin/machines/:id/validate
```

**HEADERS**
```
Authorization: Bearer TOKEN_ADMIN
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Machine validée"
}
```

---

### ✔️ 6. GÉRER LITIGE

**URL:**
```
POST http://localhost:4000/api/admin/disputes
```

**HEADERS**
```
Authorization: Bearer TOKEN_ADMIN
```

**BODY (raw / JSON)**
```json
{
  "reservationId": "res123",
  "decision": "remboursement",
  "notes": "Problème résolu avec remboursement partiel"
}
```

**RESPONSE (200 OK)**
```json
{
  "success": true,
  "message": "Litige résolu"
}
```

---

## 👥 13 — RÔLES ET PERMISSIONS

### Vue d'ensemble des rôles

L'API ALLOTRACTEUR gère 3 rôles distincts avec des permissions et des accès différents:

- **ADMIN**: Super administrateur avec accès total
- **PRESTATAIRE**: Propriétaire de machines agricoles
- **PRODUCTEUR**: Locataire de machines (rôle par défaut)

---

### 🔴 ADMIN - Super Administrateur

**Accès complet à la plateforme**

#### Endpoints Réservés Admin

```
GET    /api/admin/stats                    → Statistiques globales
GET    /api/admin/users                    → TOUS les utilisateurs
GET    /api/admin/users/:id                → Détails de N'IMPORTE QUEL utilisateur
PUT    /api/admin/users/:id/role           → Changer le rôle utilisateur
PUT    /api/admin/users/:id/toggle-status  → Activer/Désactiver compte
DELETE /api/admin/users/:id                → Supprimer utilisateur
GET    /api/admin/machines                 → TOUTES les machines
DELETE /api/admin/machines/:id             → Supprimer machine
GET    /api/admin/reservations             → TOUTES les réservations
PUT    /api/admin/reservations/:id/cancel  → Annuler réservation
GET    /api/admin/payments                 → TOUS les paiements
PUT    /api/admin/machines/:id/validate    → Valider machine
POST   /api/admin/disputes                 → Gérer litiges
```

#### Ce que l'Admin voit

**Statistiques Globales:**
- Total utilisateurs (producteurs + prestataires + admins)
- Total machines (toutes les machines de tous les prestataires)
- Total réservations (toutes les réservations)
- Chiffre d'affaires global
- Graphiques d'activité

**Exemple Response:**
```json
{
  "utilisateurs": {
    "total": 250,
    "producteurs": 180,
    "prestataires": 70
  },
  "machines": {
    "total": 125,
    "disponibles": 98
  },
  "reservations": {
    "total": 450,
    "enCours": 25
  },
  "paiements": {
    "revenuTotal": 33750000
  }
}
```

#### Pouvoirs Spéciaux

- Voir TOUS les utilisateurs
- Changer les rôles (producteur ↔ prestataire ↔ admin)
- Désactiver/Supprimer des comptes
- Voir TOUTES les machines
- Voir TOUTES les réservations
- Voir TOUS les paiements
- Résoudre les litiges

---

### 🟢 PRESTATAIRE - Propriétaire de Machines

**Accès: MES machines, MES réservations reçues, MES revenus**

#### Endpoints Réservés Prestataire

```
GET    /api/prestataire/dashboard          → Mon dashboard
GET    /api/prestataire/machines           → MES machines
POST   /api/machines                       → Créer machine
PUT    /api/machines/:id                   → Modifier MA machine
DELETE /api/machines/:id                   → Supprimer MA machine
GET    /api/prestataire/reservations       → Réservations de MES machines
PUT    /api/reservations/:id/confirm       → Confirmer réservation
PUT    /api/reservations/:id/reject        → Refuser réservation
PUT    /api/reservations/:id/complete      → Terminer réservation
GET    /api/prestataire/paiements          → MES revenus
GET    /api/prestataire/avis               → Avis sur MES machines
GET    /api/prestataire/calendrier         → Calendrier de MES machines
GET    /api/machines/:id/statistiques      → Stats de MA machine
```

#### Ce que le Prestataire voit

**Dashboard Prestataire (GET /api/prestataire/dashboard):**
```json
{
  "machines": {
    "total": 15,                    // MES machines uniquement
    "disponibles": 12,
    "indisponibles": 3,
    "parType": {
      "tracteur": 10,
      "moissonneuse": 5
    }
  },
  "reservations": {
    "total": 156,                   // Réservations de MES machines
    "enAttente": 12,
    "confirmees": 23,
    "enCours": 8,
    "terminees": 98,
    "tauxOccupation": "68.59%"
  },
  "finances": {
    "revenuTotal": 2450000,         // MES revenus uniquement
    "revenuMoisEnCours": 520000,
    "evolution": "+15.5%"
  }
}
```

#### Restrictions Prestataire

**NE VOIT PAS:**
- Machines des autres prestataires
- Réservations des autres prestataires
- Revenus des autres prestataires
- Réservations des producteurs (sauf celles pour SES machines)
- Statistiques globales de la plateforme

**NE PEUT PAS:**
- Modifier/Supprimer machines des autres
- Voir les paiements des producteurs
- Changer son rôle ou celui des autres
- Accéder aux routes /api/admin/*

---

### 🟡 PRODUCTEUR - Locataire de Machines

**Accès: MES réservations, MES dépenses, machines disponibles**

#### Endpoints Producteur

```
GET    /api/producteur/dashboard           → Mon dashboard
GET    /api/producteur/reservations        → MES réservations
POST   /api/reservations                   → Créer réservation
PUT    /api/reservations/:id/cancel        → Annuler MA réservation
GET    /api/producteur/paiements           → MES paiements effectués
POST   /api/payments/initiate              → Payer réservation
GET    /api/producteur/avis                → MES avis donnés
POST   /api/avis                           → Laisser avis
GET    /api/machines                       → Machines disponibles
GET    /api/search                         → Rechercher machines
GET    /api/producteur/historique          → MON historique
```

#### Ce que le Producteur voit

**Dashboard Producteur (GET /api/producteur/dashboard):**
```json
{
  "reservations": {
    "total": 45,                    // MES réservations uniquement
    "enAttente": 3,
    "confirmees": 8,
    "enCours": 2,
    "terminees": 28
  },
  "finances": {
    "depensesTotales": 850000,      // MES dépenses uniquement
    "depenseMoisEnCours": 220000,
    "evolution": "+22.2%"
  },
  "statistiques": {
    "reservationsParType": {        // Types que J'ai loués
      "tracteur": 30,
      "moissonneuse": 15
    },
    "machinesPreferees": [...],     // Machines que JE loue souvent
    "heuresTotal": 230
  }
}
```

**Machines Disponibles (GET /api/machines):**
```json
{
  "data": [
    {
      "_id": "mach123",
      "nom": "Tracteur John Deere",
      "prixLocation": 75000,
      "disponibilite": true,
      "prestataire": {              // Voit info du prestataire
        "nom": "Fall Ousmane",
        "telephone": "221771234567",
        "rating": 4.5
      }
    }
  ]
}
```

#### Restrictions Producteur

**NE VOIT PAS:**
- Réservations des autres producteurs
- Dépenses des autres producteurs
- Revenus des prestataires
- Statistiques globales de la plateforme
- Machines indisponibles (sauf détails pour info)

**NE PEUT PAS:**
- Créer/Modifier/Supprimer des machines
- Confirmer/Refuser des réservations
- Voir les revenus des prestataires
- Changer son rôle ou celui des autres
- Accéder aux routes /api/admin/* ou /api/prestataire/*

---

### 📊 Tableau Comparatif des Accès

| Fonctionnalité | Admin | Prestataire | Producteur |
|----------------|:-----:|:-----------:|:----------:|
| **MACHINES** |
| Voir TOUTES les machines | ✅ | ❌ | ✅ (disponibles) |
| Voir MES machines | - | ✅ | ❌ |
| Créer machine | ❌ | ✅ | ❌ |
| Modifier machine | ✅ (toutes) | ✅ (miennes) | ❌ |
| Supprimer machine | ✅ (toutes) | ✅ (miennes) | ❌ |
| **RÉSERVATIONS** |
| Voir TOUTES les réservations | ✅ | ❌ | ❌ |
| Voir réservations reçues | - | ✅ | ❌ |
| Voir réservations faites | - | ❌ | ✅ |
| Créer réservation | ❌ | ❌ | ✅ |
| Confirmer/Refuser | - | ✅ | ❌ |
| Annuler | ✅ (toutes) | ✅ (miennes) | ✅ (miennes) |
| **PAIEMENTS** |
| Voir TOUS les paiements | ✅ | ❌ | ❌ |
| Voir MES revenus | - | ✅ | ❌ |
| Voir MES dépenses | - | ❌ | ✅ |
| Effectuer paiement | ❌ | ❌ | ✅ |
| **AVIS** |
| Voir TOUS les avis | ✅ | ❌ | ❌ |
| Voir avis reçus (mes machines) | - | ✅ | ❌ |
| Voir avis donnés | - | ❌ | ✅ |
| Laisser avis | ❌ | ❌ | ✅ |
| **UTILISATEURS** |
| Voir TOUS les utilisateurs | ✅ | ❌ | ❌ |
| Changer rôles | ✅ | ❌ | ❌ |
| Activer/Désactiver comptes | ✅ | ❌ | ❌ |
| Supprimer utilisateurs | ✅ | ❌ | ❌ |
| **STATISTIQUES** |
| Statistiques globales | ✅ | ❌ | ❌ |
| Mes statistiques | - | ✅ | ✅ |

---

### 🔄 Changement de Rôle

**SEUL L'ADMIN peut changer les rôles**

#### Endpoint

```
PUT /api/admin/users/:userId/role
```

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Body:**
```json
{
  "role": "prestataire"
}
```

**Valeurs possibles:**
- `"producteur"` - Locataire de machines
- `"prestataire"` - Propriétaire de machines
- `"admin"` - Super administrateur

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Rôle modifié avec succès",
  "data": {
    "_id": "user123",
    "nom": "Diallo",
    "prenom": "Amadou",
    "role": "prestataire",
    "ancienRole": "producteur"
  }
}
```

#### Processus de Changement

1. User s'inscrit → Rôle par défaut: `"producteur"`

2. Admin se connecte et obtient son token:
```bash
POST /api/auth/login
{
  "email": "admin@allotracteur.sn",
  "motDePasse": "admin_password"
}
```

3. Admin change le rôle:
```bash
PUT /api/admin/users/507f1f77bcf86cd799439011/role
Authorization: Bearer <ADMIN_TOKEN>
{
  "role": "prestataire"
}
```

4. User se reconnecte pour obtenir un nouveau JWT:
```bash
POST /api/auth/login
{
  "email": "utilisateur@allotracteur.sn",
  "motDePasse": "password123"
}
```

5. User obtient un nouveau token avec le nouveau rôle
6. Accès aux routes correspondantes (ex: `/api/prestataire/*`)

---

### 🔐 Sécurité des Rôles

#### Middleware d'Authentification

Chaque route protégée utilise 2 middlewares:

```javascript
// Exemple route prestataire
router.use(authenticate);      // 1. Vérifie JWT valide
router.use(isPrestataire);     // 2. Vérifie role = 'prestataire'
```

#### Tentative d'Accès Non Autorisé

**Si un producteur essaie d'accéder au dashboard prestataire:**

```bash
GET /api/prestataire/dashboard
Authorization: Bearer <PRODUCTEUR_TOKEN>
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Accès réservé aux prestataires",
  "code": "FORBIDDEN"
}
```

#### Rôle dans le JWT

Le rôle est encodé dans le JWT:

```javascript
// Structure du JWT
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "utilisateur@allotracteur.sn",
  "role": "prestataire",              // ← Rôle inclus
  "iat": 1702000000,
  "exp": 1702604800
}
```

**IMPORTANT:** Le rôle dans le JWT n'est mis à jour qu'après reconnexion!

---

### 📋 Résumé Rapide

#### 🔴 ADMIN
- **Voit:** TOUT (tous utilisateurs, toutes machines, toutes réservations, tous paiements)
- **Peut:** Gérer TOUT, changer les rôles
- **Routes:** `/api/admin/*`

#### 🟢 PRESTATAIRE
- **Voit:** MES machines, MES réservations reçues, MES revenus
- **Peut:** Gérer MES machines, accepter/refuser réservations
- **Routes:** `/api/prestataire/*`, `/api/machines` (CRUD sur les siennes)
- **Limite:** Ne voit rien des autres prestataires

#### 🟡 PRODUCTEUR
- **Voit:** MES réservations, MES dépenses, machines disponibles
- **Peut:** Réserver machines, payer, laisser avis
- **Routes:** `/api/producteur/*`, `/api/reservations` (CRUD sur les siennes)
- **Limite:** Ne voit rien des autres producteurs

**Séparation stricte des données! Chacun voit uniquement ce qui le concerne.**

---

## 🌍 LANGUES SUPPORTÉES

L'API supporte 3 langues via le header `Accept-Language`:

- `fr` - Français (par défaut)
- `wo` - Wolof
- `en` - English

**Exemple:**
```
GET http://localhost:4000/api/machines
Headers:
  Accept-Language: wo
```

**RESPONSE (Wolof)**
```json
{
  "success": true,
  "message": "Machines yi am nañu",
  "data": [...]
}
```

---

## 🔒 AUTHENTIFICATION

Tous les endpoints protégés nécessitent un token JWT dans le header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Le token est retourné lors de la connexion/inscription et expire après 7 jours.

---

## ⚠️ CODES D'ERREUR

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource non trouvée |
| 409 | Conflit (ex: email déjà utilisé) |
| 422 | Données invalides |
| 429 | Trop de requêtes |
| 500 | Erreur serveur |

**Exemple de réponse d'erreur:**
```json
{
  "success": false,
  "message": "Email déjà utilisé",
  "code": "EMAIL_ALREADY_EXISTS"
}
```

---

## 📝 NOTES IMPORTANTES

1. **Rate Limiting:** 100 requêtes par 15 minutes
2. **Pagination:** Par défaut `limit=10`, max `limit=100`
3. **Upload Images:** Max 5 images, 5MB chacune
4. **Dates:** Format ISO 8601 (YYYY-MM-DD)
5. **Montants:** En FCFA (XOF)
6. **Téléphone:** Format international (+221XXXXXXXXX)

---

## 🚀 TESTS RAPIDES

**1. Créer un compte:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","prenom":"User","email":"test@test.sn","telephone":"221770000000","motDePasse":"password123","role":"producteur"}'
```

**2. Se connecter:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.sn","motDePasse":"password123"}'
```

**3. Obtenir les machines:**
```bash
curl http://localhost:4000/api/machines
```

---

## 📞 SUPPORT

Pour toute question sur l'API:
- Email: dev@allotracteur.sn
- Documentation complète: https://docs.allotracteur.sn
- Collection Postman: Importer `POSTMAN_COLLECTION.json`
