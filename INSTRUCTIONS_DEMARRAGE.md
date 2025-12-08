# Instructions de Démarrage - ALLOTRACTEUR API

## TESTS LOCAUX (OBLIGATOIRES avant Vercel)

### 1. Vérifier la configuration
```bash
npm run verify
```
Doit afficher : **Configuration PARFAITE! - 14 succès, 0 erreurs**

### 2. Démarrer le serveur
```bash
npm start
```

Vous devriez voir :
```
✅ Connecté à MongoDB Atlas
✅ Serveur démarré sur le port 4000
📡 API disponible sur: http://localhost:4000
```

### 3. Tester (dans un nouveau terminal)

#### Option A : Test rapide manuel
```bash
curl http://localhost:4000/
```

Résultat attendu :
```json
{
  "success": true,
  "message": "Bienvenue sur l'API ALLOTRACTEUR",
  "version": "1.0.0",
  "status": "OK"
}
```

#### Option B : Test automatique complet
```bash
npm run test:local
```

Résultat attendu :
```
🎉 TOUS LES TESTS SONT PASSÉS!
✅ 6/6 tests réussis
✅ Votre backend est prêt pour le déploiement Vercel
```

---

## DÉPLOIEMENT VERCEL (après tests locaux OK)

### Étape 1 : MongoDB Atlas (30 secondes)
```
1. Allez sur https://cloud.mongodb.com
2. Cliquez sur votre cluster
3. Security → Network Access
4. Add IP Address
5. Entrez : 0.0.0.0/0
6. Description : "Vercel Deployment"
7. Confirm
```

### Étape 2 : Vercel - Variables (5 minutes)
```
1. Allez sur https://vercel.com
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Ouvrez le fichier : COPIER_COLLER_VERCEL.txt
5. Ajoutez CHAQUE variable (une par une)
6. Pour chaque variable :
   - Name : [nom]
   - Value : [valeur]
   - ✓ Production
   - ✓ Preview
   - ✓ Development
   - Save
```

**Variables CRITIQUES** (ajoutez en priorité) :
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV` = production

**Variables importantes** :
- Cloudinary (3 variables)
- PayTech (7 variables)
- Email (6 variables)

### Étape 3 : Redéployer (2 minutes)
```
1. Vercel → Deployments
2. Dernier déploiement → ⋯ (trois points)
3. Redeploy
4. ✓ Use existing Build Cache
5. Redeploy
6. Attendez 1-2 minutes
```

### Étape 4 : Tester Vercel
```bash
# Remplacez [VOTRE-URL] par votre URL Vercel
curl https://[VOTRE-URL].vercel.app/
```

Résultat attendu (identique au local) :
```json
{
  "success": true,
  "message": "Bienvenue sur l'API ALLOTRACTEUR",
  "version": "1.0.0",
  "environment": "production",
  "status": "OK"
}
```

---

## DÉPANNAGE

### Problème : Le serveur local ne démarre pas

**Erreur : `MongoDB connection failed`**
```bash
# Solution 1 : Vérifiez votre .env
cat .env | grep MONGO_URI

# Solution 2 : Testez la connexion MongoDB
npm run verify

# Solution 3 : Ajoutez votre IP sur MongoDB Atlas
# https://cloud.mongodb.com → Network Access → Add Current IP Address
```

**Erreur : `Port 4000 already in use`**
```bash
# Linux/Mac
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
# Puis : taskkill /PID [le_PID] /F

# Ou changez le port dans .env
echo "PORT=5000" >> .env
```

**Erreur : `Module not found`**
```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Problème : Tests locaux échouent

**Test curl échoue : `Connection refused`**
```bash
# Le serveur n'est pas démarré
npm start

# Attendez 2-3 secondes, puis retestez
curl http://localhost:4000/
```

**Test retourne une erreur 500**
```bash
# Vérifiez les logs
npm run logs

# Ou consultez : logs/error.log
cat logs/error.log
```

### Problème : Erreurs sur Vercel

**Erreur : `MONGO_URI is undefined`**
```
Cause : Variables d'environnement non configurées
Solution : Ajoutez MONGO_URI dans Vercel Settings → Environment Variables
```

**Erreur : `MongoNetworkError`**
```
Cause : MongoDB refuse la connexion depuis Vercel
Solution : MongoDB Atlas → Network Access → Ajoutez 0.0.0.0/0
```

**Erreur 500 : `Internal Server Error`**
```
Cause : Une variable critique est manquante
Solution :
1. Vercel → Deployments → View Function Logs
2. Identifiez la variable manquante
3. Ajoutez-la dans Settings → Environment Variables
4. Redéployez
```

**Page vide ou 404**
```
Cause : Le déploiement n'est pas terminé
Solution : Attendez 2-3 minutes après le déploiement
```

---

## CHECKLIST COMPLÈTE

### Avant de déployer sur Vercel :
- [ ] `npm run verify` → 14 succès, 0 erreurs
- [ ] `npm start` → Serveur démarre sans erreur
- [ ] `curl localhost:4000/` → success: true
- [ ] `curl localhost:4000/health` → status: OK
- [ ] `npm run test:local` → 6/6 tests réussis

### Configuration Vercel :
- [ ] MongoDB Atlas : IP 0.0.0.0/0 autorisée
- [ ] Vercel : MONGO_URI configuré
- [ ] Vercel : JWT_SECRET configuré
- [ ] Vercel : NODE_ENV=production configuré
- [ ] Vercel : Variables Cloudinary configurées (3)
- [ ] Vercel : Variables PayTech configurées (7)
- [ ] Vercel : Variables Email configurées (6)

### Après déploiement Vercel :
- [ ] Déploiement terminé (statut : Ready)
- [ ] `curl [VOTRE-URL].vercel.app/` → success: true
- [ ] `curl [VOTRE-URL].vercel.app/health` → status: OK
- [ ] `curl [VOTRE-URL].vercel.app/api/machines` → retourne des données

---

## COMMANDES UTILES

```bash
# Développement
npm run dev           # Démarrer avec nodemon (auto-reload)
npm start             # Démarrer normalement
npm run verify        # Vérifier la configuration
npm run test:local    # Tester tous les endpoints

# Base de données
npm run seed          # Ajouter des données de test
npm run seed:clear    # Supprimer toutes les données

# Monitoring
npm run logs          # Voir les logs en temps réel
cat logs/error.log    # Voir les erreurs
cat logs/combined.log # Voir tous les logs

# Build et déploiement
npm run build         # Vérifier que le build fonctionne
```

---

## SUPPORT

Fichiers de documentation :
- `TEST_LOCAL_COMPLET.md` - Tests détaillés
- `COPIER_COLLER_VERCEL.txt` - Variables d'environnement
- `GUIDE_DEPLOIEMENT_RAPIDE.md` - Guide complet
- `CONFIGURATION_VERCEL.md` - Configuration détaillée
- `README.md` - Documentation générale

API Endpoints disponibles :
- Page d'accueil : `GET /`
- Health check : `GET /health`
- Documentation : Voir le fichier `LISTE_COMPLETE_ENDPOINTS.md`

---

## NOTES IMPORTANTES

1. **TOUJOURS tester en local avant de déployer**
2. **MongoDB Atlas : Autorisez 0.0.0.0/0 pour Vercel**
3. **Vercel : Ajoutez TOUTES les variables d'environnement**
4. **Redéployez après avoir ajouté les variables**
5. **Attendez 2-3 minutes après chaque déploiement**

Si quelque chose ne fonctionne pas :
1. Vérifiez les logs : `npm run logs` (local) ou Vercel Logs (production)
2. Vérifiez la configuration : `npm run verify`
3. Vérifiez MongoDB : Network Access doit autoriser votre IP / Vercel
4. Vérifiez les variables d'environnement sur Vercel

---

**Un code qui marche en local marchera sur Vercel** (avec les bonnes variables).

Testez localement d'abord, puis déployez avec confiance.
