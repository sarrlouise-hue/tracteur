# Test Local Complet - ALLOTRACTEUR API

## Avant de déployer sur Vercel - Testez en local

### Étape 1 : Vérifier la configuration
```bash
npm run verify
```

**Résultat attendu :**
```
✅ Configuration PARFAITE!
✅ Succès: 14
⚠️  Avertissements: 0
❌ Erreurs: 0
```

### Étape 2 : Démarrer le serveur local
```bash
npm start
```

**Résultat attendu :**
```
✅ Connecté à MongoDB Atlas
✅ Serveur démarré sur le port 4000
🌍 Environnement: development
📡 API disponible sur: http://localhost:4000
🏥 Health check: http://localhost:4000/health
```

### Étape 3 : Tester les endpoints (autre terminal)

#### Test 1 : Page d'accueil
```bash
curl http://localhost:4000/
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "Bienvenue sur l'API ALLOTRACTEUR",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2025-12-08T...",
  "endpoints": {
    "health": "/health",
    "auth": { ... },
    "machines": { ... },
    "services": { ... },
    "reservations": { ... },
    ...
  },
  "status": "OK"
}
```

#### Test 2 : Health Check
```bash
curl http://localhost:4000/health
```

**Résultat attendu :**
```json
{
  "status": "OK",
  "message": "API ALLOTRACTEUR fonctionnelle",
  "timestamp": "2025-12-08T...",
  "uptime": 45.67
}
```

#### Test 3 : API Machines
```bash
curl http://localhost:4000/api/machines
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": [],
  "message": "Aucune machine trouvée"
}
```

#### Test 4 : Script de test automatique
```bash
node test-serveur-local.js
```

**Résultat attendu :**
```
🧪 TEST DU SERVEUR LOCAL ALLOTRACTEUR

✅ Page d'accueil (/)
   Status: 200
   Message: Bienvenue sur l'API ALLOTRACTEUR
   Version: 1.0.0
   Endpoints disponibles: 9 groupes

✅ Health Check (/health)
   Status: 200

✅ Liste machines (/api/machines)
   Status: 200

✅ Liste services (/api/services)
   Status: 200

✅ Liste prestataires (/api/prestataires)
   Status: 200

✅ Route 404 (doit retourner erreur)
   Status: 404

📊 RÉSULTAT: 6/6 tests réussis

🎉 TOUS LES TESTS SONT PASSÉS!
✅ Votre backend est prêt pour le déploiement Vercel
```

## Résolution des problèmes locaux

### Erreur : ECONNREFUSED
**Symptôme :** `Error: connect ECONNREFUSED 127.0.0.1:4000`

**Cause :** Le serveur n'est pas démarré

**Solution :**
```bash
npm start
```

### Erreur : MongoDB connection failed
**Symptôme :** `MongoServerError: Authentication failed`

**Cause :** MONGO_URI incorrect ou réseau

**Solution :**
1. Vérifiez votre fichier `.env`
2. Vérifiez que `MONGO_URI` est correct
3. Vérifiez votre connexion Internet
4. MongoDB Atlas : Network Access → Ajoutez votre IP actuelle

### Erreur : Port already in use
**Symptôme :** `Error: listen EADDRINUSE: address already in use :::4000`

**Cause :** Le port 4000 est déjà utilisé

**Solution :**
```bash
# Linux/Mac
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID [PID] /F
```

Ou changez le port dans `.env`:
```env
PORT=5000
```

### Erreur : Module not found
**Symptôme :** `Error: Cannot find module 'express'`

**Cause :** Dépendances non installées

**Solution :**
```bash
npm install
```

## Checklist avant déploiement Vercel

Une fois que TOUS les tests locaux passent :

- [ ] `npm run verify` → Succès: 14, Erreurs: 0
- [ ] `npm start` → Serveur démarre sans erreur
- [ ] `curl localhost:4000/` → success: true
- [ ] `curl localhost:4000/health` → status: OK
- [ ] `curl localhost:4000/api/machines` → success: true
- [ ] `node test-serveur-local.js` → 6/6 tests réussis

**SI TOUS LES TESTS PASSENT → Vous pouvez déployer sur Vercel en toute sécurité!**

## Après tests locaux OK → Déployer sur Vercel

### 1. MongoDB Atlas - Autoriser Vercel
```
1. https://cloud.mongodb.com
2. Network Access → Add IP Address
3. IP: 0.0.0.0/0
4. Description: "Vercel Deployment"
5. Confirm
```

### 2. Vercel - Variables d'environnement
```
1. Vercel → Settings → Environment Variables
2. Copiez depuis COPIER_COLLER_VERCEL.txt
3. Ajoutez TOUTES les variables
4. Sélectionnez: Production + Preview + Development
```

### 3. Redéployer
```
1. Vercel → Deployments
2. ⋯ → Redeploy
3. Attendez 2 minutes
```

### 4. Tester sur Vercel
```bash
# Remplacez [VOTRE-URL] par votre URL Vercel
curl https://[VOTRE-URL].vercel.app/

# Résultat attendu (identique au local):
{
  "success": true,
  "message": "Bienvenue sur l'API ALLOTRACTEUR",
  "version": "1.0.0",
  "environment": "production",
  ...
}
```

## Support

Si vous avez des erreurs en local, corrigez-les AVANT de déployer sur Vercel.
Un code qui fonctionne en local fonctionnera sur Vercel (avec les bonnes variables d'environnement).
