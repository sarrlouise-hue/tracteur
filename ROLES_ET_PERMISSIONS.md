# ROLES ET PERMISSIONS - ALLOTRACTEUR

## 👤 Ce que voit chaque utilisateur

---

## 🔴 ADMIN - Super Administrateur

### Accès Complet à la Plateforme

#### 📊 Dashboard Admin
**Endpoint:** `GET /api/admin/statistics`

**Voit:**
- Statistiques globales de la plateforme
- Nombre total d'utilisateurs (par rôle)
- Nombre total de machines
- Nombre total de réservations
- Chiffre d'affaires global
- Graphiques d'activité

---

#### 👥 Gestion Utilisateurs (TOUS)
**Endpoints:**
```
GET    /api/admin/users              → Liste TOUS les utilisateurs
GET    /api/admin/users/:id          → Détails de N'IMPORTE QUEL utilisateur
PUT    /api/admin/users/:id/role     → ⭐ CHANGER le rôle (producteur ↔ prestataire ↔ admin)
PUT    /api/admin/users/:id/status   → Activer/Désactiver N'IMPORTE QUEL compte
DELETE /api/admin/users/:id          → Supprimer N'IMPORTE QUEL utilisateur
```

**Voit pour chaque utilisateur:**
- Nom, prénom, email, téléphone
- Rôle actuel (producteur/prestataire/admin)
- Statut (actif/inactif)
- Date d'inscription
- Localisation
- Statistiques d'activité
- **PEUT MODIFIER LE RÔLE** ⭐

---

#### 🚜 Supervision Machines (TOUTES)
**Endpoint:** `GET /api/admin/machines`

**Voit:**
- TOUTES les machines de TOUS les prestataires
- Type, modèle, année
- Disponibilité
- Tarifs
- Localisation
- Nombre de réservations
- Revenus générés
- **PEUT SUPPRIMER des machines problématiques**

---

#### 📅 Supervision Réservations (TOUTES)
**Endpoint:** `GET /api/admin/reservations`

**Voit:**
- TOUTES les réservations de TOUS les utilisateurs
- Producteur qui réserve
- Prestataire qui loue
- Machine réservée
- Dates, durée, montant
- Statut (en attente, confirmée, en cours, terminée, annulée)
- **PEUT ANNULER des réservations problématiques**

---

#### 💰 Supervision Paiements (TOUS)
**Endpoint:** `GET /api/admin/payments`

**Voit:**
- TOUS les paiements de TOUS les utilisateurs
- Montant de chaque transaction
- Méthode de paiement
- Statut (en attente, validé, échoué, remboursé)
- ID transaction PayTech
- **Peut suivre tout l'argent qui circule**

---

### 🔐 Pouvoirs Spéciaux Admin

| Action | Admin | Autres |
|--------|-------|--------|
| Voir TOUS les utilisateurs | ✅ | ❌ |
| Changer les rôles | ✅ | ❌ |
| Désactiver des comptes | ✅ | ❌ |
| Supprimer des utilisateurs | ✅ | ❌ |
| Voir TOUTES les machines | ✅ | ❌ |
| Voir TOUTES les réservations | ✅ | ❌ |
| Voir TOUS les paiements | ✅ | ❌ |
| Statistiques globales | ✅ | ❌ |

---

---

## 🟢 PRESTATAIRE - Propriétaire de Machines

### Accès: Mes Machines et Mes Revenus

#### 📊 Dashboard Prestataire
**Endpoint:** `GET /api/prestataire/dashboard`

**Voit:**
- Statistiques de MES machines uniquement
- MES réservations reçues uniquement
- MES revenus générés uniquement
- Calendrier de disponibilité de MES machines
- Avis sur MES machines

**Données visibles:**
```json
{
  "machines": {
    "total": 15,                    // MES machines
    "disponibles": 12,
    "indisponibles": 3,
    "parType": {
      "tracteur": 10,
      "moissonneuse": 5
    }
  },

  "reservations": {
    "total": 156,                   // Réservations de MES machines
    "enAttente": 12,                // À confirmer
    "confirmees": 23,               // Confirmées
    "enCours": 8,                   // En cours
    "terminees": 98,                // Terminées
    "annulees": 15,
    "tauxOccupation": "68.59%"
  },

  "finances": {
    "revenuTotal": 2450000,         // MES revenus
    "revenuMoisEnCours": 520000,
    "revenuMoisPrecedent": 450000,
    "evolution": "+15.5%"
  },

  "performances": {
    "machinesPlusRentables": [...], // MES machines les plus louées
    "periodesPlusActives": [...]
  }
}
```

---

#### 🚜 Mes Machines
**Endpoint:** `GET /api/prestataire/machines`

**Voit:**
- Liste de MES machines uniquement
- **NE VOIT PAS les machines des autres prestataires**

**Peut faire:**
- Ajouter de nouvelles machines
- Modifier MES machines
- Supprimer MES machines
- Changer la disponibilité
- Voir statistiques par machine

---

#### 📅 Mes Réservations Reçues
**Endpoint:** `GET /api/prestataire/reservations`

**Voit:**
- Réservations de MES machines uniquement
- Qui réserve (nom du producteur, contact)
- Quelle machine
- Dates et durée
- Montant à recevoir
- **NE VOIT PAS les réservations des autres prestataires**

**Peut faire:**
- Accepter/Refuser les demandes
- Voir historique de MES locations

---

#### 💰 Mes Revenus
**Endpoint:** `GET /api/prestataire/paiements`

**Voit:**
- MES paiements reçus uniquement
- Montants gagnés
- Historique de MES revenus par mois
- **NE VOIT PAS les revenus des autres prestataires**

---

#### ⭐ Mes Avis Reçus
**Endpoint:** `GET /api/prestataire/avis`

**Voit:**
- Avis laissés sur MES machines
- Note moyenne de MES machines
- Commentaires des producteurs sur MES services
- **NE VOIT PAS les avis des autres prestataires**

---

#### 📊 Statistiques de Mes Machines
**Endpoint:** `GET /api/prestataire/machines/:machineId/statistiques`

**Voit par machine:**
- Nombre de locations
- Heures totales louées
- Revenu généré
- Taux d'occupation
- Note moyenne
- **Uniquement pour MES machines**

---

#### 📆 Mon Calendrier
**Endpoint:** `GET /api/prestataire/calendrier`

**Voit:**
- Calendrier de disponibilité de MES machines
- Périodes réservées
- Périodes libres
- **NE VOIT PAS le calendrier des autres**

---

### 🚫 Ce que le PRESTATAIRE ne voit PAS

❌ Machines des autres prestataires
❌ Réservations des autres prestataires
❌ Revenus des autres prestataires
❌ Informations des producteurs (sauf lors de réservation)
❌ Statistiques globales de la plateforme
❌ Liste des utilisateurs
❌ **NE PEUT PAS changer son rôle**

---

---

## 🟡 PRODUCTEUR - Locataire de Machines

### Accès: Mes Réservations et Mes Dépenses

#### 📊 Dashboard Producteur
**Endpoint:** `GET /api/producteur/dashboard`

**Voit:**
- Statistiques de MES réservations uniquement
- MES dépenses uniquement
- Historique de MES locations
- Mes machines préférées

**Données visibles:**
```json
{
  "reservations": {
    "total": 45,                    // MES réservations
    "enAttente": 3,                 // En attente de confirmation
    "confirmees": 8,                // Confirmées par prestataire
    "enCours": 2,                   // En cours d'utilisation
    "terminees": 28,                // Terminées
    "annulees": 4
  },

  "finances": {
    "depensesTotales": 850000,      // MES dépenses
    "depenseMoisEnCours": 220000,
    "depenseMoisPrecedent": 180000,
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

---

#### 📅 Mes Réservations Faites
**Endpoint:** `GET /api/producteur/reservations`

**Voit:**
- MES réservations uniquement
- Machines que J'ai réservées
- Prestataires chez qui JE loue
- Dates de MES locations
- Montants que JE paie
- **NE VOIT PAS les réservations des autres producteurs**

**Peut faire:**
- Créer nouvelle réservation
- Annuler MES réservations
- Voir détails de MES réservations

---

#### 💰 Mes Paiements Effectués
**Endpoint:** `GET /api/producteur/paiements`

**Voit:**
- MES paiements effectués uniquement
- Montants que J'ai payés
- Historique de MES dépenses
- **NE VOIT PAS les paiements des autres producteurs**

---

#### ⭐ Mes Avis Donnés
**Endpoint:** `GET /api/producteur/avis`

**Voit:**
- Avis que J'ai donnés
- MES notes sur les machines louées
- MES commentaires sur les prestataires
- **NE VOIT PAS les avis des autres producteurs**

**Peut faire:**
- Laisser un avis après location
- Modifier MES avis

---

#### 🚜 Machines Disponibles à la Location
**Endpoint:** `GET /api/producteur/machines-disponibles`

**Voit:**
- TOUTES les machines disponibles à louer
- Informations des prestataires (nom, contact, note)
- Prix, localisation, disponibilité
- Avis d'autres producteurs

**Peut rechercher par:**
- Type de machine
- Localisation (avec rayon en km)
- Prix
- Disponibilité

---

#### 📜 Mon Historique
**Endpoint:** `GET /api/producteur/historique`

**Voit:**
- MES réservations terminées
- Statistiques de MES locations passées
- Filtres par année/mois
- **NE VOIT PAS l'historique des autres**

---

### 🚫 Ce que le PRODUCTEUR ne voit PAS

❌ Réservations des autres producteurs
❌ Dépenses des autres producteurs
❌ Revenus des prestataires
❌ Machines indisponibles (sauf pour info)
❌ Statistiques globales de la plateforme
❌ Liste des utilisateurs
❌ **NE PEUT PAS changer son rôle**

---

---

## 📊 TABLEAU COMPARATIF

| Fonctionnalité | Admin | Prestataire | Producteur |
|----------------|-------|-------------|------------|
| **MACHINES** |
| Voir TOUTES les machines | ✅ | ❌ | ✅ (disponibles) |
| Voir MES machines | - | ✅ | ❌ |
| Ajouter une machine | ❌ | ✅ | ❌ |
| Modifier une machine | ✅ (toutes) | ✅ (miennes) | ❌ |
| Supprimer une machine | ✅ (toutes) | ✅ (miennes) | ❌ |
| **RÉSERVATIONS** |
| Voir TOUTES les réservations | ✅ | ❌ | ❌ |
| Voir réservations reçues | - | ✅ | ❌ |
| Voir réservations faites | - | ❌ | ✅ |
| Créer une réservation | ❌ | ❌ | ✅ |
| Confirmer/Refuser réservation | - | ✅ | ❌ |
| Annuler réservation | ✅ (toutes) | ✅ (miennes) | ✅ (miennes) |
| **PAIEMENTS** |
| Voir TOUS les paiements | ✅ | ❌ | ❌ |
| Voir MES revenus | - | ✅ | ❌ |
| Voir MES dépenses | - | ❌ | ✅ |
| Effectuer un paiement | ❌ | ❌ | ✅ |
| **AVIS** |
| Voir TOUS les avis | ✅ | ❌ | ❌ |
| Voir avis reçus | - | ✅ | ❌ |
| Voir avis donnés | - | ❌ | ✅ |
| Laisser un avis | ❌ | ❌ | ✅ |
| **UTILISATEURS** |
| Voir TOUS les utilisateurs | ✅ | ❌ | ❌ |
| Changer les rôles | ✅ | ❌ | ❌ |
| Activer/Désactiver comptes | ✅ | ❌ | ❌ |
| Supprimer utilisateurs | ✅ | ❌ | ❌ |
| **STATISTIQUES** |
| Statistiques globales | ✅ | ❌ | ❌ |
| Mes statistiques | - | ✅ | ✅ |

---

## 🔄 CHANGEMENT DE RÔLE

### Qui peut changer le rôle?

**SEUL L'ADMIN peut changer les rôles ⭐**

#### Processus:

```
1. User s'inscrit → Role par défaut: "producteur"

2. Admin se connecte à son dashboard
   └─ Voit TOUS les utilisateurs
   └─ PUT /api/admin/users/:id/role
   └─ Change le rôle: "producteur" → "prestataire"

3. User se reconnecte
   └─ Nouveau JWT avec nouveau rôle
   └─ Accès au dashboard correspondant
```

#### Exemple:

**Avant:**
- Mamadou Diallo = **producteur**
- Accès: `/api/producteur/*`
- Voit: Ses réservations, ses dépenses

**Admin change le rôle:**
```bash
PUT /api/admin/users/507f1f77bcf86cd799439011/role
{ "role": "prestataire" }
```

**Après:**
- Mamadou Diallo = **prestataire**
- Accès: `/api/prestataire/*`
- Voit: Ses machines, ses revenus

---

## 🔐 SÉCURITÉ

### Protection des Routes

**Chaque dashboard protégé par 2 middlewares:**

```javascript
// Exemple route prestataire
router.use(authenticate);      // 1. JWT valide?
router.use(isPrestataire);     // 2. Role = 'prestataire'?
```

### Tentative d'Accès Non Autorisé

**Si un producteur essaie d'accéder au dashboard prestataire:**
```
GET /api/prestataire/dashboard
Authorization: Bearer <producteur_token>

Response: 403 Forbidden
{
  "success": false,
  "message": "Accès réservé aux prestataires"
}
```

### Base de Données

**Le rôle est stocké dans MongoDB:**
```javascript
// modele.utilisateur.js
role: {
  type: String,
  enum: ['producteur', 'prestataire', 'admin'],
  default: 'producteur'
}
```

**Seul admin peut modifier via:**
```
PUT /api/admin/users/:id/role
```

---

## 🎯 RÉSUMÉ RAPIDE

### 🔴 ADMIN
- **Voit:** TOUT
- **Peut:** Gérer TOUT
- **Pouvoir spécial:** Changer les rôles

### 🟢 PRESTATAIRE
- **Voit:** MES machines, MES revenus, MES réservations reçues
- **Peut:** Gérer MES machines, accepter/refuser réservations
- **Limite:** Ne voit rien des autres prestataires

### 🟡 PRODUCTEUR
- **Voit:** MES réservations, MES dépenses, machines disponibles
- **Peut:** Réserver des machines, payer, laisser des avis
- **Limite:** Ne voit rien des autres producteurs

---

**Séparation stricte des données! Chacun voit uniquement ce qui le concerne. ✅**
