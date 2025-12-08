# Configuration Variables d'Environnement sur Vercel

## Problème Résolu

Le backend retournait des erreurs 500 avec le message :
```
The `uri` parameter to `openUri()` must be a string, got "undefined"
```

**Cause** : Les variables d'environnement (notamment `MONGO_URI`) ne sont pas configurées sur Vercel.

## Solution : Configurer les Variables d'Environnement

### Étape 1 : Accéder aux Paramètres Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Ouvrez votre projet : **backend-complet-misajour-allotracteur**
3. Cliquez sur **Settings** (en haut)
4. Dans le menu latéral, cliquez sur **Environment Variables**

### Étape 2 : Ajouter les Variables Requises

Ajoutez **TOUTES** ces variables d'environnement :

#### Variables Obligatoires (CRITICAL)

| Variable | Valeur | Description |
|----------|--------|-------------|
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/allo-tracteur` | URI MongoDB Atlas |
| `JWT_SECRET` | `votre_secret_jwt_tres_securise` | Clé secrète JWT (min 32 caractères) |
| `NODE_ENV` | `production` | Environnement de production |

#### Variables Cloudinary (Images)

| Variable | Valeur |
|----------|--------|
| `CLOUDINARY_CLOUD_NAME` | `dt8fos8ws` |
| `CLOUDINARY_API_KEY` | `955324417262215` |
| `CLOUDINARY_API_SECRET` | `3Cwl3IA-VUu8so6hhN2O8b1TfOI` |

#### Variables PayTech (Paiements)

| Variable | Valeur |
|----------|--------|
| `PAYTECH_API_KEY` | Votre clé PayTech |
| `PAYTECH_API_SECRET` | Votre secret PayTech |
| `PAYTECH_BASE_URL` | `https://paytech.sn/api` |
| `PAYTECH_CALLBACK_SECRET` | Votre webhook secret |
| `PAYTECH_SUCCESS_URL` | URL de votre frontend + `/payment/success` |
| `PAYTECH_CANCEL_URL` | URL de votre frontend + `/payment/cancel` |
| `PAYTECH_IPN_URL` | URL Vercel + `/api/payments/webhook` |

#### Variables Email (Nodemailer)

| Variable | Valeur |
|----------|--------|
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_SECURE` | `false` |
| `EMAIL_USER` | `infos.allotracteur@gmail.com` |
| `EMAIL_PASSWORD` | Mot de passe d'application Gmail |
| `EMAIL_FROM` | `ALLOTRACTEUR <infos.allotracteur@gmail.com>` |

#### Variables Optionnelles

| Variable | Valeur | Par défaut |
|----------|--------|------------|
| `CORS_ORIGIN` | `*` ou URL frontend | `*` |
| `JWT_EXPIRES_IN` | `7d` | `7d` |
| `RATE_LIMIT_WINDOW_MS` | `900000` | 15 minutes |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | 100 |
| `LOG_LEVEL` | `info` | `info` |
| `SMS_ENABLED` | `true` | `true` |

### Étape 3 : Configuration dans Vercel

Pour chaque variable :

1. Cliquez sur **Add New**
2. **Name** : Nom de la variable (ex: `MONGO_URI`)
3. **Value** : Valeur de la variable
4. **Environment** : Sélectionnez **Production**, **Preview**, et **Development**
5. Cliquez sur **Save**

### Étape 4 : Redéployer

Après avoir ajouté toutes les variables :

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les 3 points ⋯ du dernier déploiement
3. Sélectionnez **Redeploy**
4. Cochez **Use existing Build Cache**
5. Cliquez sur **Redeploy**

## Vérification

Une fois redéployé, testez votre API :

```bash
# Test de santé
curl https://votre-url-vercel.vercel.app/health

# Résultat attendu
{
  "status": "OK",
  "message": "API ALLOTRACTEUR fonctionnelle",
  "timestamp": "2025-12-08T...",
  "uptime": 123.45
}
```

## Notes Importantes

### MongoDB Atlas

Assurez-vous que :
1. Votre IP Vercel est autorisée dans MongoDB Atlas
   - MongoDB Atlas → Network Access
   - **Ajoutez** : `0.0.0.0/0` (ou IP Vercel spécifique)
2. Votre utilisateur MongoDB a les permissions nécessaires
3. Le nom de la base de données est correct dans `MONGO_URI`

### JWT Secret

Générez un secret sécurisé :
```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Email Gmail

Pour obtenir un mot de passe d'application Gmail :
1. Compte Google → Sécurité
2. Activer la validation en 2 étapes
3. Mots de passe des applications → Créer
4. Copier le mot de passe de 16 caractères

### Variables Sensibles

⚠️ **NE JAMAIS COMMIT** les fichiers `.env` dans Git

Les variables sensibles doivent UNIQUEMENT être dans :
- Vercel → Environment Variables (production)
- Fichier `.env` local (développement) - dans `.gitignore`

## Résolution des Problèmes

### Erreur : MONGO_URI undefined
→ La variable n'est pas configurée sur Vercel
→ Ajoutez-la dans Settings → Environment Variables

### Erreur : MongoNetworkError
→ Vercel n'a pas accès à MongoDB Atlas
→ Autorisez `0.0.0.0/0` dans Network Access

### Erreur : Invalid JWT
→ `JWT_SECRET` n'est pas défini ou différent
→ Vérifiez qu'il est identique partout

### Erreur 503 Service Unavailable
→ Vérifiez les logs Vercel
→ Une variable d'environnement critique est manquante

## Support

Pour plus d'aide :
- [Documentation Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Network Access](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
