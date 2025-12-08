# Démarrage Rapide - 3 ÉTAPES

## ÉTAPE 1 : TESTER EN LOCAL (2 minutes)

```bash
# 1. Vérifier la config
npm run verify

# 2. Démarrer le serveur
npm start

# 3. Tester (nouveau terminal)
curl http://localhost:4000/
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "Bienvenue sur l'API ALLOTRACTEUR",
  "status": "OK"
}
```

**SI SUCCESS = TRUE → Passez à l'étape 2**

---

## ÉTAPE 2 : CONFIGURER VERCEL (5 minutes)

### A. MongoDB Atlas
```
1. https://cloud.mongodb.com
2. Network Access → Add IP Address
3. IP : 0.0.0.0/0
4. Confirm
```

### B. Vercel Variables
```
1. https://vercel.com → Votre projet
2. Settings → Environment Variables
3. Ouvrez : COPIER_COLLER_VERCEL.txt
4. Ajoutez CHAQUE variable
5. Sélectionnez : ✓ Production ✓ Preview ✓ Development
```

**Variables CRITIQUES :**
- MONGO_URI
- JWT_SECRET
- NODE_ENV=production

---

## ÉTAPE 3 : DÉPLOYER (2 minutes)

```
1. Vercel → Deployments
2. ⋯ → Redeploy
3. Attendez 2 minutes
4. Testez :
   curl https://[VOTRE-URL].vercel.app/
```

**Résultat attendu (identique au local) :**
```json
{
  "success": true,
  "message": "Bienvenue sur l'API ALLOTRACTEUR",
  "environment": "production",
  "status": "OK"
}
```

---

## DÉPANNAGE RAPIDE

### Local ne fonctionne pas
```bash
# Erreur MongoDB ?
npm run verify

# Port occupé ?
lsof -ti:4000 | xargs kill -9
npm start
```

### Vercel ne fonctionne pas
```
1. Vercel → Settings → Environment Variables
2. Vérifiez que MONGO_URI est présent
3. MongoDB Atlas → Network Access → 0.0.0.0/0
4. Redéployez
```

---

## COMMANDES ESSENTIELLES

```bash
npm run verify      # Vérifier config
npm start           # Démarrer serveur
npm run test:local  # Tester tout
npm run seed        # Ajouter données test
npm run logs        # Voir les logs
```

---

## FICHIERS UTILES

- `INSTRUCTIONS_DEMARRAGE.md` - Guide complet
- `TEST_LOCAL_COMPLET.md` - Tests détaillés
- `COPIER_COLLER_VERCEL.txt` - Variables d'environnement
- `GUIDE_DEPLOIEMENT_RAPIDE.md` - Déploiement détaillé

---

**Un code qui marche en local marchera sur Vercel.**

Testez local → Configurez Vercel → Déployez
