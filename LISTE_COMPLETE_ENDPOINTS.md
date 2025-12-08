# Liste Complète des Endpoints - ALLOTRACTEUR API v2.0.0

## Total: 65+ Endpoints

---

## 1. AUTHENTIFICATION (6 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Inscription |
| POST | `/api/auth/login` | ❌ | Connexion |
| POST | `/api/auth/forgot-password` | ❌ | Demande OTP |
| POST | `/api/auth/verify-otp` | ❌ | Vérifier OTP |
| POST | `/api/auth/reset-password` | ❌ | Réinitialiser mot de passe |
| GET | `/api/auth/profile` | ✅ | Mon profil |

---

## 2. DASHBOARD ADMIN (9 endpoints)

**Rôle requis: admin**

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/statistics` | Statistiques générales |
| GET | `/api/admin/users` | Liste utilisateurs |
| GET | `/api/admin/users/:id` | Détails utilisateur |
| PUT | `/api/admin/users/:id/role` | Changer rôle |
| PUT | `/api/admin/users/:id/status` | Activer/Désactiver |
| DELETE | `/api/admin/users/:id` | Supprimer utilisateur |
| GET | `/api/admin/machines` | Liste machines |
| GET | `/api/admin/reservations` | Liste réservations |
| GET | `/api/admin/payments` | Liste paiements |

---

## 3. DASHBOARD PRODUCTEUR (6 endpoints)

**Rôle requis: producteur**

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/producteur/dashboard` | Statistiques producteur |
| GET | `/api/producteur/reservations` | Mes réservations |
| GET | `/api/producteur/paiements` | Mes paiements |
| GET | `/api/producteur/avis` | Mes avis |
| GET | `/api/producteur/machines-disponibles` | Recherche machines |
| GET | `/api/producteur/historique` | Historique réservations |

---

## 4. DASHBOARD PRESTATAIRE (7 endpoints)

**Rôle requis: prestataire**

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/prestataire/dashboard` | Statistiques prestataire |
| GET | `/api/prestataire/machines` | Mes machines |
| GET | `/api/prestataire/reservations` | Mes réservations |
| GET | `/api/prestataire/paiements` | Paiements reçus |
| GET | `/api/prestataire/avis` | Avis reçus |
| GET | `/api/prestataire/machines/:machineId/statistiques` | Stats machine |
| GET | `/api/prestataire/calendrier` | Calendrier réservations |

---

## 5. GESTION DES UTILISATEURS (5 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/users` | ✅ | Liste utilisateurs |
| GET | `/api/users/:id` | ✅ | Profil utilisateur |
| PUT | `/api/users/profile` | ✅ | Mettre à jour profil |
| PUT | `/api/users/change-password` | ✅ | Changer mot de passe |
| DELETE | `/api/users/profile` | ✅ | Supprimer compte |

---

## 6. GESTION DES PRESTATAIRES (4 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/prestataires` | ❌ | Liste prestataires |
| GET | `/api/prestataires/:id` | ❌ | Détails prestataire |
| GET | `/api/prestataires/:id/machines` | ❌ | Machines du prestataire |
| GET | `/api/prestataires/:id/avis` | ❌ | Avis du prestataire |

---

## 7. GESTION DES MACHINES (6 endpoints)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/api/machines` | ❌ | - | Liste machines |
| GET | `/api/machines/:id` | ❌ | - | Détails machine |
| POST | `/api/machines` | ✅ | prestataire | Créer machine |
| PUT | `/api/machines/:id` | ✅ | prestataire | Modifier machine |
| DELETE | `/api/machines/:id` | ✅ | prestataire | Supprimer machine |
| GET | `/api/machines/:id/disponibilites` | ❌ | - | Vérifier disponibilité |

---

## 8. GESTION DES SERVICES (4 endpoints)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/api/services` | ❌ | - | Liste services |
| POST | `/api/services` | ✅ | prestataire | Créer service |
| PUT | `/api/services/:id` | ✅ | prestataire | Modifier service |
| DELETE | `/api/services/:id` | ✅ | prestataire | Supprimer service |

---

## 9. GESTION DES RÉSERVATIONS (7 endpoints)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/api/reservations` | ✅ | - | Liste réservations |
| GET | `/api/reservations/:id` | ✅ | - | Détails réservation |
| POST | `/api/reservations` | ✅ | producteur | Créer réservation |
| PUT | `/api/reservations/:id/confirm` | ✅ | prestataire | Confirmer |
| PUT | `/api/reservations/:id/cancel` | ✅ | - | Annuler |
| PUT | `/api/reservations/:id/start` | ✅ | prestataire | Démarrer |
| PUT | `/api/reservations/:id/complete` | ✅ | prestataire | Terminer |

---

## 10. GESTION DES PAIEMENTS (4 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/payments/initiate` | ✅ | Initier paiement |
| GET | `/api/payments/:id/status` | ✅ | Statut paiement |
| GET | `/api/payments` | ✅ | Historique paiements |
| POST | `/api/payments/webhook/paytech` | ❌ | Webhook PayTech |

---

## 11. GESTION DES AVIS (5 endpoints)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| POST | `/api/avis` | ✅ | producteur | Créer avis |
| GET | `/api/avis/machine/:machineId` | ❌ | - | Avis machine |
| GET | `/api/avis/prestataire/:prestataireId` | ❌ | - | Avis prestataire |
| POST | `/api/avis/:id/reponse` | ✅ | prestataire | Répondre |
| POST | `/api/avis/:id/signaler` | ✅ | - | Signaler |

---

## 12. RECHERCHE (3 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/recherche` | ❌ | Recherche globale |
| GET | `/api/recherche/localisation` | ❌ | Recherche géographique |
| GET | `/api/recherche/filtres` | ❌ | Filtres avancés |

---

## 13. NOTIFICATIONS (5 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/notifications` | ✅ | Liste notifications |
| PUT | `/api/notifications/:id/read` | ✅ | Marquer comme lue |
| PUT | `/api/notifications/read-all` | ✅ | Tout marquer comme lu |
| DELETE | `/api/notifications/:id` | ✅ | Supprimer |
| GET | `/api/notifications/unread-count` | ✅ | Nombre non lues |

---

## 14. HISTORIQUE (3 endpoints)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/historique/reservations` | ✅ | Historique réservations |
| GET | `/api/historique/payments` | ✅ | Historique paiements |
| GET | `/api/historique/activites` | ✅ | Activités récentes |

---

## 15. SYSTÈME (1 endpoint)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/health` | ❌ | Santé de l'API |

---

## Résumé par Catégorie

| Catégorie | Nombre d'endpoints |
|-----------|-------------------|
| Authentification | 6 |
| Dashboard Admin | 9 |
| Dashboard Producteur | 6 |
| Dashboard Prestataire | 7 |
| Utilisateurs | 5 |
| Prestataires | 4 |
| Machines | 6 |
| Services | 4 |
| Réservations | 7 |
| Paiements | 4 |
| Avis | 5 |
| Recherche | 3 |
| Notifications | 5 |
| Historique | 3 |
| Système | 1 |
| **TOTAL** | **65+** |

---

## Endpoints par Rôle

### Endpoints Publics (Sans Auth) - 16
- Authentification: 5 (register, login, forgot-password, verify-otp, reset-password)
- Prestataires: 4 (liste, détails, machines, avis)
- Machines: 2 (liste, détails, disponibilités)
- Recherche: 3
- Système: 1 (health)
- Services: 1 (liste)

### Endpoints Authentifiés (Tous rôles) - 22
- Auth profile: 1
- Utilisateurs: 5
- Notifications: 5
- Historique: 3
- Réservations: 2 (liste, détails)
- Paiements: 3
- Avis: 2 (signaler, voir)

### Endpoints Admin Uniquement - 9
- Tous les `/api/admin/*`

### Endpoints Producteur Uniquement - 7
- Dashboard producteur: 6
- Créer réservation: 1

### Endpoints Prestataire Uniquement - 11
- Dashboard prestataire: 7
- Machines (créer, modifier, supprimer): 3
- Services (créer, modifier, supprimer): 3
- Confirmer/démarrer/terminer réservation: 3
- Répondre aux avis: 1

---

## Query Parameters Standards

### Pagination (Toutes les listes)
```
?page=1
?limit=20
```

### Filtres Communs
```
?statut=en_attente
?disponible=true
?type=tracteur
?role=producteur
?isActive=true
```

### Recherche
```
?q=tracteur
?localisation=-16.9331,14.7934
?rayon=50
?prixMin=10000
?prixMax=50000
?noteMin=4
```

### Dates
```
?dateDebut=2025-12-01
?dateFin=2025-12-31
?annee=2025
?mois=12
```

---

## Headers Requis

### Authentication
```
Authorization: Bearer <token>
```

### Content-Type (POST/PUT)
```
Content-Type: application/json
```

### Upload de fichiers
```
Content-Type: multipart/form-data
```

---

## Réponses Standards

### Succès (200/201)
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### Erreur (400/401/403/404/500)
```json
{
  "success": false,
  "message": "...",
  "error": { ... }
}
```

### Liste paginée
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

## Codes HTTP Utilisés

| Code | Description | Utilisation |
|------|-------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Ressource introuvable |
| 409 | Conflict | Conflit (ex: réservation existante) |
| 500 | Server Error | Erreur serveur |

---

## Rate Limiting

- **Limite:** 100 requêtes / 15 minutes par IP
- **Routes protégées:** Toutes les routes `/api/*`
- **Header réponse:** `X-RateLimit-*`

---

## Exemples d'Utilisation

### Obtenir les statistiques producteur
```bash
curl -X GET http://localhost:3000/api/producteur/dashboard \
  -H "Authorization: Bearer <token>"
```

### Créer une réservation
```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "machineId": "xxx",
    "dateDebut": "2025-12-10T08:00:00Z",
    "dateFin": "2025-12-10T16:00:00Z"
  }'
```

### Rechercher machines par localisation
```bash
curl -X GET "http://localhost:3000/api/recherche/localisation?latitude=14.7934&longitude=-16.9331&rayon=30"
```

---

## WebHooks

### PayTech
- **URL:** `POST /api/payments/webhook/paytech`
- **Authentification:** Signature PayTech
- **Déclenchement:** Automatique par PayTech
- **Actions:** Mise à jour statut paiement, notification

---

## Notes Importantes

1. **Tous les endpoints avec Auth** nécessitent un token JWT valide
2. **Les dashboards** sont accessibles uniquement par le rôle correspondant
3. **La pagination** est recommandée pour toutes les listes
4. **Les timestamps** sont au format ISO 8601
5. **Les coordonnées** sont au format [longitude, latitude]
6. **Les montants** sont en FCFA (centimes)

---

## Documentation Complète

Pour plus de détails sur chaque endpoint, consulter:
- `DOCUMENTATION_API_COMPLETE.md` - Documentation exhaustive
- `POSTMAN_COLLECTION_COMPLETE.json` - Collection Postman

---

**Total Endpoints: 65+ | Version: 2.0.0 | Status: ✅ Production Ready**
