# 🚀 GUIDE DE DÉPLOIEMENT EN PRODUCTION

Ce guide vous explique comment déployer ALLOTRACTEUR API en production sans erreur.

---

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#prérequis)
2. [Configuration MongoDB Atlas](#configuration-mongodb-atlas)
3. [Configuration des Services](#configuration-des-services)
4. [Déploiement sur Railway](#déploiement-sur-railway)
5. [Déploiement sur Heroku](#déploiement-sur-heroku)
6. [Déploiement sur VPS](#déploiement-sur-vps)
7. [Configuration DNS et Domaine](#configuration-dns-et-domaine)
8. [Tests Post-Déploiement](#tests-post-déploiement)
9. [Monitoring et Maintenance](#monitoring-et-maintenance)
10. [Résolution des Erreurs Courantes](#résolution-des-erreurs-courantes)

---

## ✅ PRÉREQUIS

Avant de déployer, assurez-vous d'avoir:

- [ ] Un compte MongoDB Atlas (gratuit)
- [ ] Un compte Cloudinary (gratuit)
- [ ] Un compte PayTech (production)
- [ ] Un compte Gmail pour les emails
- [ ] Un compte Twilio pour les SMS (optionnel)
- [ ] Un nom de domaine (ex: allotracteur.sn)
- [ ] Git installé localement

---

## 🗄️ CONFIGURATION MONGODB ATLAS

### Étape 1: Créer un Cluster

1. Allez sur https://cloud.mongodb.com
2. Créez un compte ou connectez-vous
3. Cliquez sur **"Build a Database"**
4. Choisissez **"M0 Free"** (gratuit)
5. Sélectionnez la région **"Frankfurt (eu-central-1)"** (proche du Sénégal)
6. Nommez votre cluster: `allotracteur-prod`
7. Cliquez sur **"Create"**

### Étape 2: Créer un Utilisateur

1. Dans **Security** > **Database Access**
2. Cliquez sur **"Add New Database User"**
3. Méthode: **Password**
4. Username: `allotracteur_user`
5. Générez un mot de passe fort (sauvegardez-le!)
6. Database User Privileges: **Read and write to any database**
7. Cliquez sur **"Add User"**

### Étape 3: Whitelist IP

1. Dans **Security** > **Network Access**
2. Cliquez sur **"Add IP Address"**
3. Choisissez **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Commentaire: "Production Server"
5. Cliquez sur **"Confirm"**

### Étape 4: Obtenir l'URI de Connexion

1. Dans **Deployment** > **Database**
2. Cliquez sur **"Connect"**
3. Choisissez **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copiez l'URI:
   ```
   mongodb+srv://allotracteur_user:<password>@allotracteur-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Remplacez `<password>` par votre mot de passe
7. Ajoutez le nom de la base après `.net/`: `allotracteur-prod`
   ```
   mongodb+srv://allotracteur_user:VotreMotDePasse@allotracteur-prod.xxxxx.mongodb.net/allotracteur-prod?retryWrites=true&w=majority
   ```

---

## ☁️ CONFIGURATION DES SERVICES

### CLOUDINARY (Upload Images)

1. Allez sur https://cloudinary.com
2. Créez un compte ou connectez-vous
3. Dans **Dashboard**, notez:
   - `Cloud Name`: dt8fos8ws
   - `API Key`: 955324417262215
   - `API Secret`: 3Cwl3IA-VUu8so6hhN2O8b1TfOI

### PAYTECH (Paiements Mobile Money)

1. Contactez PayTech: https://paytech.sn
2. Demandez un compte **PRODUCTION**
3. Vous recevrez:
   - `API Key`
   - `API Secret`
4. Mode: `production` (pas `test`)

### GMAIL (Envoi Emails)

1. Connectez-vous à votre Gmail
2. Activez la **validation en 2 étapes**:
   - https://myaccount.google.com/security
   - Sécurité > Validation en 2 étapes
3. Créez un **mot de passe d'application**:
   - https://myaccount.google.com/apppasswords
   - Nom: "ALLOTRACTEUR API"
   - Copiez le mot de passe (16 caractères)

### TWILIO (SMS - Optionnel)

1. Allez sur https://www.twilio.com
2. Créez un compte
3. Dans **Console**, notez:
   - `Account SID`
   - `Auth Token`
4. Achetez un numéro sénégalais ou international

---

## 🚂 DÉPLOIEMENT SUR RAILWAY

Railway est la méthode la plus simple et recommandée.

### Étape 1: Préparer le Projet

```bash
# Cloner le projet
git clone https://github.com/votre-repo/allotracteur-api.git
cd allotracteur-api

# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit"

# Créer un repo GitHub
# Allez sur github.com > New Repository
# Nom: allotracteur-api
# Public ou Private

# Push vers GitHub
git remote add origin https://github.com/votre-username/allotracteur-api.git
git branch -M main
git push -u origin main
```

### Étape 2: Déployer sur Railway

1. Allez sur https://railway.app
2. Connectez-vous avec GitHub
3. Cliquez sur **"New Project"**
4. Choisissez **"Deploy from GitHub repo"**
5. Sélectionnez `allotracteur-api`
6. Railway détecte automatiquement Node.js

### Étape 3: Configurer les Variables d'Environnement

1. Cliquez sur votre projet
2. Onglet **"Variables"**
3. Ajoutez TOUTES les variables de `.env.production.example`:

```env
# Serveur
NODE_ENV=production
PORT=4000

# MongoDB Atlas (VOTRE URI)
MONGO_URI=mongodb+srv://allotracteur_user:VotreMotDePasse@allotracteur-prod.xxxxx.mongodb.net/allotracteur-prod?retryWrites=true&w=majority

# JWT (GÉNÉRER UNE NOUVELLE CLÉ)
JWT_SECRET=votre_secret_production_tres_long_et_securise_64_caracteres_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=dt8fos8ws
CLOUDINARY_API_KEY=955324417262215
CLOUDINARY_API_SECRET=3Cwl3IA-VUu8so6hhN2O8b1TfOI

# PayTech (PRODUCTION)
PAYTECH_API_KEY=votre_cle_prod
PAYTECH_API_SECRET=votre_secret_prod
PAYTECH_ENV=production
PAYTECH_BASE_URL=https://paytech.sn/api
PAYTECH_CALLBACK_SECRET=votre_secret_webhook_unique

# URLs (Railway vous donnera une URL)
PAYTECH_IPN_URL=https://allotracteur-api-production.up.railway.app/api/payments/webhook
PAYTECH_SUCCESS_URL=https://allotracteur.sn/payment-success
PAYTECH_CANCEL_URL=https://allotracteur.sn/payment-cancel

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app-gmail
EMAIL_FROM=ALLOTRACTEUR <noreply@allotracteur.sn>

# SMS
SMS_PROVIDER=twilio
SMS_API_KEY=votre_twilio_sid
SMS_API_SECRET=votre_twilio_token
SMS_SENDER=+221771234567
SMS_ENABLED=true

# CORS (votre domaine frontend)
CORS_ORIGIN=https://allotracteur.sn,https://www.allotracteur.sn

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Logs
LOG_LEVEL=warn
```

### Étape 4: Générer JWT Secret Sécurisé

Sur votre terminal local:

```bash
# Générer un secret de 64 caractères
openssl rand -base64 64
```

Copiez le résultat dans `JWT_SECRET`.

### Étape 5: Déployer

1. Railway détecte les changements automatiquement
2. Le déploiement commence
3. Attendez 2-3 minutes
4. Votre API est en ligne!

### Étape 6: Obtenir l'URL

1. Dans Railway, cliquez sur **"Settings"**
2. Section **"Domains"**
3. Railway génère: `https://allotracteur-api-production.up.railway.app`
4. Vous pouvez ajouter un domaine custom

---

## 🟣 DÉPLOIEMENT SUR HEROKU

### Étape 1: Installer Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Téléchargez depuis: https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Étape 2: Se Connecter

```bash
heroku login
```

### Étape 3: Créer l'Application

```bash
# Dans le dossier du projet
cd allotracteur-api

# Créer l'app
heroku create allotracteur-api-prod

# Ajouter le buildpack Node.js
heroku buildpacks:set heroku/nodejs
```

### Étape 4: Configurer les Variables

```bash
# MongoDB
heroku config:set MONGO_URI="mongodb+srv://..."

# JWT
heroku config:set JWT_SECRET="votre_secret_64_caracteres"
heroku config:set JWT_EXPIRES_IN="7d"

# Cloudinary
heroku config:set CLOUDINARY_CLOUD_NAME="dt8fos8ws"
heroku config:set CLOUDINARY_API_KEY="955324417262215"
heroku config:set CLOUDINARY_API_SECRET="3Cwl3IA-VUu8so6hhN2O8b1TfOI"

# PayTech
heroku config:set PAYTECH_API_KEY="votre_cle"
heroku config:set PAYTECH_API_SECRET="votre_secret"
heroku config:set PAYTECH_ENV="production"
heroku config:set PAYTECH_IPN_URL="https://allotracteur-api-prod.herokuapp.com/api/payments/webhook"

# Email
heroku config:set EMAIL_USER="votre-email@gmail.com"
heroku config:set EMAIL_PASSWORD="votre-mot-de-passe-app"

# CORS
heroku config:set CORS_ORIGIN="https://allotracteur.sn"

# Node Env
heroku config:set NODE_ENV="production"
```

### Étape 5: Créer Procfile

Créez un fichier `Procfile` à la racine:

```
web: node src/serveur.js
```

### Étape 6: Déployer

```bash
# Commit les changements
git add .
git commit -m "Configure for Heroku"

# Déployer
git push heroku main

# Ouvrir l'app
heroku open
```

### Étape 7: Voir les Logs

```bash
heroku logs --tail
```

---

## 🖥️ DÉPLOIEMENT SUR VPS (Ubuntu)

Pour un contrôle total, utilisez un VPS (DigitalOcean, Linode, AWS EC2).

### Étape 1: Créer un VPS

1. Allez sur DigitalOcean/Linode
2. Créez un Droplet Ubuntu 22.04
3. Taille: 2GB RAM minimum
4. Région: Frankfurt (proche du Sénégal)
5. Ajoutez votre clé SSH

### Étape 2: Se Connecter

```bash
ssh root@votre-ip-vps
```

### Étape 3: Installer Node.js

```bash
# Mettre à jour
apt update && apt upgrade -y

# Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Vérifier
node --version  # v20.x
npm --version   # 10.x
```

### Étape 4: Installer PM2

```bash
npm install -g pm2
```

### Étape 5: Cloner le Projet

```bash
# Installer Git
apt install -y git

# Cloner
cd /var/www
git clone https://github.com/votre-repo/allotracteur-api.git
cd allotracteur-api

# Installer les dépendances
npm install --production
```

### Étape 6: Créer le Fichier .env

```bash
nano .env
```

Collez toutes vos variables de production, puis `Ctrl+X`, `Y`, `Enter`.

### Étape 7: Lancer avec PM2

```bash
# Lancer l'API
pm2 start src/serveur.js --name allotracteur-api

# Sauvegarder la config
pm2 save

# Lancer au démarrage
pm2 startup
```

### Étape 8: Installer Nginx

```bash
# Installer
apt install -y nginx

# Créer la config
nano /etc/nginx/sites-available/allotracteur
```

Collez:

```nginx
server {
    listen 80;
    server_name api.allotracteur.sn;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/allotracteur /etc/nginx/sites-enabled/

# Tester la config
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

### Étape 9: Installer SSL (HTTPS)

```bash
# Installer Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir un certificat SSL
certbot --nginx -d api.allotracteur.sn

# Renouvellement automatique
certbot renew --dry-run
```

### Étape 10: Configurer le Firewall

```bash
# Activer UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 🌐 CONFIGURATION DNS ET DOMAINE

### Étape 1: Acheter un Domaine

1. Allez sur Namecheap, GoDaddy, ou OVH
2. Achetez `allotracteur.sn` (ou .com)

### Étape 2: Configurer les DNS

Ajoutez ces enregistrements DNS:

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| A | @ | IP_VPS | 3600 |
| A | www | IP_VPS | 3600 |
| A | api | IP_VPS | 3600 |
| CNAME | www | allotracteur.sn | 3600 |

**Pour Railway/Heroku:**

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| CNAME | api | allotracteur-api-production.up.railway.app | 3600 |

### Étape 3: Attendre la Propagation

Attendez 1-24h pour la propagation DNS.

Vérifiez:
```bash
nslookup api.allotracteur.sn
```

---

## 🧪 TESTS POST-DÉPLOIEMENT

### Test 1: Santé de l'API

```bash
curl https://api.allotracteur.sn/api/auth/login
```

Vous devriez recevoir une erreur 400 (c'est normal, pas de body).

### Test 2: Inscription

```bash
curl -X POST https://api.allotracteur.sn/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "Production",
    "email": "test-prod@allotracteur.sn",
    "telephone": "221770000001",
    "motDePasse": "TestProd123!",
    "role": "producteur"
  }'
```

Vous devriez recevoir un token.

### Test 3: Connexion

```bash
curl -X POST https://api.allotracteur.sn/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-prod@allotracteur.sn",
    "motDePasse": "TestProd123!"
  }'
```

### Test 4: Machines

```bash
curl https://api.allotracteur.sn/api/machines
```

### Test 5: PayTech Webhook

```bash
curl -X POST https://api.allotracteur.sn/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

---

## 📊 MONITORING ET MAINTENANCE

### Logs Railway

```bash
# Dans Railway Dashboard
# Onglet "Deployments" > Cliquez sur votre déploiement > "View Logs"
```

### Logs Heroku

```bash
heroku logs --tail -a allotracteur-api-prod
```

### Logs VPS (PM2)

```bash
# Logs en temps réel
pm2 logs allotracteur-api

# Erreurs uniquement
pm2 logs allotracteur-api --err

# Statut
pm2 status

# Monitoring
pm2 monit
```

### Redémarrer l'API

**Railway:** Push un nouveau commit

**Heroku:**
```bash
heroku restart -a allotracteur-api-prod
```

**VPS:**
```bash
pm2 restart allotracteur-api
```

### Mettre à Jour le Code

**VPS:**
```bash
cd /var/www/allotracteur-api
git pull origin main
npm install --production
pm2 restart allotracteur-api
```

### Sauvegardes MongoDB

```bash
# Installer MongoDB Tools
apt install -y mongodb-database-tools

# Backup
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb+srv://..." /backups/20241205
```

---

## ⚠️ RÉSOLUTION DES ERREURS COURANTES

### Erreur 1: "Cannot connect to MongoDB"

**Cause:** URI MongoDB invalide ou whitelist IP

**Solution:**
1. Vérifiez l'URI dans `.env`
2. MongoDB Atlas > Network Access > Allow 0.0.0.0/0
3. Testez la connexion:
   ```bash
   node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('OK'))"
   ```

### Erreur 2: "JWT Secret not defined"

**Cause:** Variable `JWT_SECRET` manquante

**Solution:**
```bash
# Railway/Heroku: Ajoutez dans Variables
JWT_SECRET=votre_secret_64_caracteres

# VPS: Vérifiez .env
cat .env | grep JWT_SECRET
```

### Erreur 3: "CORS Error"

**Cause:** Frontend non autorisé

**Solution:**
```bash
# Ajoutez votre domaine frontend dans CORS_ORIGIN
CORS_ORIGIN=https://allotracteur.sn,https://www.allotracteur.sn
```

### Erreur 4: "PayTech webhook not working"

**Cause:** URL IPN inaccessible

**Solution:**
1. Vérifiez que l'URL est publique:
   ```bash
   curl https://api.allotracteur.sn/api/payments/webhook
   ```
2. Fournissez cette URL à PayTech
3. Testez avec Postman

### Erreur 5: "Images not uploading"

**Cause:** Clés Cloudinary invalides

**Solution:**
1. Vérifiez sur https://cloudinary.com/console
2. Copiez les bonnes clés
3. Redémarrez l'API

### Erreur 6: "API is slow"

**Cause:** Pas d'index MongoDB

**Solution:**
```bash
# Connectez-vous à MongoDB Atlas
# Database > Collections > Indexes
# Ajoutez ces index:
# - users: email (unique)
# - machines: type, disponibilite
# - reservations: statut, dateDebut
```

### Erreur 7: "Too many requests"

**Cause:** Rate limiting

**Solution:**
Augmentez les limites dans `.env`:
```env
RATE_LIMIT_MAX_REQUESTS=200
```

### Erreur 8: "Emails not sending"

**Cause:** Mot de passe Gmail invalide

**Solution:**
1. Créez un nouveau mot de passe d'application
2. https://myaccount.google.com/apppasswords
3. Copiez-le dans `EMAIL_PASSWORD`

---

## 🎯 CHECKLIST AVANT MISE EN PRODUCTION

- [ ] MongoDB Atlas configuré avec whitelist IP
- [ ] JWT_SECRET généré avec `openssl rand -base64 64`
- [ ] Toutes les variables d'environnement définies
- [ ] CORS_ORIGIN configuré avec votre domaine exact
- [ ] PayTech en mode `production` (pas `test`)
- [ ] Email configuré avec mot de passe d'application Gmail
- [ ] DNS configuré et propagé
- [ ] SSL/HTTPS activé
- [ ] Tests d'API réussis (inscription, login, machines)
- [ ] Webhook PayTech accessible publiquement
- [ ] Logs de monitoring configurés
- [ ] Backup MongoDB planifié

---

## 📞 SUPPORT

**Problèmes de déploiement:**
- Railway: https://railway.app/help
- Heroku: https://help.heroku.com
- MongoDB: https://www.mongodb.com/docs/atlas/

**Problèmes avec l'API:**
- Email: dev@allotracteur.sn
- GitHub Issues: https://github.com/votre-repo/allotracteur-api/issues

---

## 🎉 FÉLICITATIONS!

Votre API ALLOTRACTEUR est maintenant en production! 🚜

**URLs:**
- API: `https://api.allotracteur.sn`
- Documentation: `https://api.allotracteur.sn/docs`
- Santé: `https://api.allotracteur.sn/health`

**Prochaines étapes:**
1. Connectez votre application frontend
2. Testez tous les endpoints en production
3. Activez le monitoring (Sentry, Datadog)
4. Configurez les alertes email
5. Planifiez les backups automatiques

**Bonne chance avec ALLOTRACTEUR! 🌾**
