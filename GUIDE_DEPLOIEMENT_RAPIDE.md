# Guide de Déploiement Rapide - ALLOTRACTEUR API

## Changements Effectués

### 1. Handler Vercel Amélioré (`api/index.js`)
- Validation stricte de `MONGO_URI`
- Messages d'erreur explicites si configuration manquante
- Gestion optimale des connexions MongoDB serverless

### 2. Page d'Accueil API Complète (`src/application.js`)
Ajout de la route `/` qui affiche :
- Message de bienvenue
- Version de l'API
- Environnement (production/development)
- Liste complète de tous les endpoints disponibles
- Statut de l'API

**Comme AGRO BOOST**, votre API affichera maintenant une belle page JSON avec tous les endpoints !

## Déploiement sur Vercel - 3 ÉTAPES

### ÉTAPE 1 : MongoDB Atlas - Autoriser Vercel
```
1. Allez sur https://cloud.mongodb.com
2. Sélectionnez votre cluster
3. Network Access → Add IP Address
4. Ajoutez : 0.0.0.0/0
5. Description : "Vercel Deployment"
6. Confirm
```

### ÉTAPE 2 : Vercel - Ajouter Variables d'Environnement
```
1. Vercel → Votre projet → Settings
2. Environment Variables → Add New
3. Copiez-collez depuis COPIER_COLLER_VERCEL.txt
4. Pour CHAQUE variable :
   - Name : nom de la variable
   - Value : valeur
   - Environment : ✓ Production ✓ Preview ✓ Development
   - Save
```

**Variables CRITIQUES à ajouter en priorité :**
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV` (valeur: `production`)

**Variables importantes :**
- Cloudinary (3 variables)
- PayTech (7 variables)
- Email (6 variables)

### ÉTAPE 3 : Redéployer
```
1. Vercel → Deployments
2. Dernier déploiement → ⋯ (trois points)
3. Redeploy
4. ✓ Use existing Build Cache
5. Redeploy
6. Attendez 1-2 minutes
```

## Tests Après Déploiement

### Test 1 : Page d'Accueil API
```bash
curl https://[VOTRE-URL].vercel.app/

# Résultat attendu :
{
  "success": true,
  "message": "Bienvenue sur l'API ALLOTRACTEUR",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-12-08T...",
  "endpoints": {
    "health": "/health",
    "api": "/api",
    "documentation": "/api-docs",
    "auth": { ... },
    "prestataires": { ... },
    "machines": { ... },
    ...
  },
  "status": "OK"
}
```

### Test 2 : Health Check
```bash
curl https://[VOTRE-URL].vercel.app/health

# Résultat attendu :
{
  "status": "OK",
  "message": "API ALLOTRACTEUR fonctionnelle",
  "timestamp": "2025-12-08T...",
  "uptime": 123.45
}
```

### Test 3 : Endpoint API (Machines)
```bash
curl https://[VOTRE-URL].vercel.app/api/machines

# Résultat attendu :
{
  "success": true,
  "data": [ ... ],
  ...
}
```

## Endpoints Principaux Disponibles

### Authentification
- `POST /api/auth/inscription` - Créer un compte
- `POST /api/auth/connexion` - Se connecter
- `POST /api/auth/verifier-otp` - Vérifier OTP
- `POST /api/auth/renvoyer-otp` - Renvoyer OTP

### Machines
- `GET /api/machines` - Liste des machines
- `GET /api/machines/:id` - Détails d'une machine
- `POST /api/machines` - Créer une machine
- `PUT /api/machines/:id` - Modifier une machine
- `DELETE /api/machines/:id` - Supprimer une machine

### Services
- `GET /api/services` - Liste des services
- `GET /api/services/:id` - Détails d'un service
- `POST /api/services` - Créer un service

### Réservations
- `GET /api/reservations` - Liste des réservations
- `GET /api/reservations/:id` - Détails d'une réservation
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id` - Modifier une réservation
- `PUT /api/reservations/:id/annuler` - Annuler une réservation

### Paiements
- `POST /api/payments/initier` - Initier un paiement
- `GET /api/payments/:id` - Statut d'un paiement
- `POST /api/payments/webhook` - Webhook PayTech

### Recherche
- `GET /api/recherche/machines` - Rechercher des machines
- `GET /api/recherche/services` - Rechercher des services
- `GET /api/recherche/prestataires` - Rechercher des prestataires

### Dashboards
- `GET /api/admin/dashboard` - Dashboard admin
- `GET /api/producteur/dashboard` - Dashboard producteur
- `GET /api/prestataire/dashboard` - Dashboard prestataire

## Troubleshooting

### Erreur : MONGO_URI undefined
**Cause** : Variable d'environnement non configurée sur Vercel
**Solution** : Ajoutez `MONGO_URI` dans Vercel Settings → Environment Variables

### Erreur : MongoNetworkError
**Cause** : Vercel n'a pas accès à MongoDB
**Solution** : Autorisez `0.0.0.0/0` dans MongoDB Atlas → Network Access

### Erreur 500 : Internal Server Error
**Cause** : Une variable d'environnement critique est manquante
**Solution** : Vérifiez les logs Vercel et ajoutez toutes les variables

### Page vide ou 404
**Cause** : Le déploiement n'est pas terminé
**Solution** : Attendez 2-3 minutes après le redéploiement

## Vérification Complète

Checklist avant de dire "C'est bon" :

- [ ] MongoDB Atlas : IP `0.0.0.0/0` autorisée
- [ ] Vercel : `MONGO_URI` configuré
- [ ] Vercel : `JWT_SECRET` configuré
- [ ] Vercel : `NODE_ENV=production` configuré
- [ ] Vercel : Variables Cloudinary configurées
- [ ] Vercel : Variables PayTech configurées
- [ ] Vercel : Variables Email configurées
- [ ] Déploiement Vercel terminé (statut : Ready)
- [ ] Test 1 : `curl /` retourne success: true
- [ ] Test 2 : `curl /health` retourne status: OK
- [ ] Test 3 : `curl /api/machines` fonctionne

## Support et Documentation

- **Variables d'environnement** : `COPIER_COLLER_VERCEL.txt`
- **Configuration détaillée** : `CONFIGURATION_VERCEL.md`
- **Liste des endpoints** : `LISTE_COMPLETE_ENDPOINTS.md`
- **Documentation API** : `DOCUMENTATION_API.md`

## Notes Finales

Après le déploiement, votre API affichera **exactement comme AGRO BOOST** :
- Une belle page d'accueil avec tous les endpoints
- Statut OK
- Version et environnement
- Liste complète des routes disponibles

Tous vos endpoints fonctionneront normalement une fois les variables d'environnement configurées.
