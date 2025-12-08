# 🚀 DÉMARRAGE RAPIDE - ALLOTRACTEUR API

Guide ultra-rapide pour lancer l'API en local en 5 minutes.

---

## ⚡ INSTALLATION RAPIDE

### 1. Cloner le Projet

```bash
git clone https://github.com/votre-repo/allotracteur-api.git
cd allotracteur-api
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configurer l'Environnement

Copiez le fichier d'exemple:

```bash
cp .env.example .env
```

Éditez `.env` et remplissez AU MINIMUM:

```env
# MongoDB Atlas (OBLIGATOIRE)
MONGO_URI=mongodb+srv://votre-uri-mongodb

# JWT (OBLIGATOIRE)
JWT_SECRET=votre_secret_jwt_changez_moi

# Cloudinary (OBLIGATOIRE pour upload images)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# PayTech (OBLIGATOIRE pour paiements)
PAYTECH_API_KEY=votre_cle_paytech
PAYTECH_API_SECRET=votre_secret_paytech
```

### 4. Créer des Données de Test

```bash
npm run seed
```

Cela va créer:
- 5 producteurs
- 5 prestataires
- 15 machines
- 10 réservations
- 8 paiements

### 5. Lancer le Serveur

```bash
npm run dev
```

L'API sera disponible sur: **http://localhost:4000**

---

## ✅ TESTER L'API

### Test 1: Inscription

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Diallo",
    "prenom": "Amadou",
    "email": "amadou@test.sn",
    "telephone": "221770000000",
    "motDePasse": "password123",
    "role": "producteur"
  }'
```

### Test 2: Connexion

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "amadou@test.sn",
    "motDePasse": "password123"
  }'
```

Copiez le `token` retourné.

### Test 3: Lister les Machines

```bash
curl http://localhost:4000/api/machines
```

### Test 4: Mon Profil (avec token)

```bash
curl http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 📚 DOCUMENTATION COMPLÈTE

- **API complète:** Voir `DOCUMENTATION_API.md` (65+ endpoints)
- **Déploiement production:** Voir `GUIDE_DEPLOIEMENT.md`
- **Collection Postman:** Importer `POSTMAN_COLLECTION.json`

---

## 🌍 LANGUES SUPPORTÉES

L'API supporte 3 langues:
- 🇫🇷 Français (par défaut)
- 🇸🇳 Wolof
- 🇬🇧 English

Ajoutez le header `Accept-Language`:

```bash
curl http://localhost:4000/api/machines \
  -H "Accept-Language: wo"
```

---

## 🔧 COMMANDES UTILES

```bash
# Développement avec auto-reload
npm run dev

# Production
npm start

# Tests
npm test

# Tests avec couverture
npm run test

# Créer données de test
npm run seed

# Supprimer toutes les données
npm run seed:clear

# Voir les logs
npm run logs

# Linter
npm run lint
```

---

## 📂 STRUCTURE DU PROJET

```
allotracteur-api/
├── src/
│   ├── config/           # Configuration (DB, i18n, PayTech, etc.)
│   ├── controllers/      # Contrôleurs (logique métier)
│   ├── data-access/      # Dépôts (accès base de données)
│   ├── middleware/       # Middlewares (auth, erreurs, i18n)
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API
│   ├── services/         # Services (email, SMS, paiements, etc.)
│   ├── utils/            # Utilitaires
│   ├── webhooks/         # Webhooks (PayTech)
│   ├── seeders/          # Données de test
│   ├── application.js    # Configuration Express
│   └── serveur.js        # Point d'entrée
├── tests/                # Tests unitaires et intégration
├── logs/                 # Logs Winston
├── .env                  # Variables d'environnement (local)
├── .env.example          # Exemple de configuration (local)
├── .env.production.example  # Exemple de configuration (production)
├── package.json
├── DOCUMENTATION_API.md  # Documentation API complète
├── GUIDE_DEPLOIEMENT.md  # Guide de déploiement
└── POSTMAN_COLLECTION.json  # Collection Postman
```

---

## 🎯 ENDPOINTS PRINCIPAUX

| Catégorie | Endpoint | Méthode |
|-----------|----------|---------|
| Auth | `/api/auth/register` | POST |
| Auth | `/api/auth/login` | POST |
| Machines | `/api/machines` | GET |
| Machines | `/api/machines` | POST |
| Réservations | `/api/reservations` | POST |
| Réservations | `/api/reservations/my/reservations` | GET |
| Paiements | `/api/payments/initiate` | POST |
| Avis | `/api/avis` | POST |
| Recherche | `/api/search` | POST |
| Admin | `/api/admin/stats` | GET |

**Total:** 65+ endpoints

Voir `DOCUMENTATION_API.md` pour la liste complète.

---

## 🐛 PROBLÈMES COURANTS

### "Cannot connect to MongoDB"

Vérifiez votre `MONGO_URI` dans `.env`.

Solution rapide:
1. Allez sur https://cloud.mongodb.com
2. Créez un cluster gratuit
3. Whitelist IP: 0.0.0.0/0
4. Copiez l'URI de connexion

### "JWT Secret not defined"

Ajoutez dans `.env`:
```env
JWT_SECRET=allotracteur_secret_key_2024_changez_moi
```

### "Cloudinary error"

Vérifiez vos clés Cloudinary dans `.env`.

Créez un compte gratuit: https://cloudinary.com

### "Seed error"

Supprimez les données existantes:
```bash
npm run seed:clear
npm run seed
```

---

## 📞 SUPPORT

**Questions?**
- Email: dev@allotracteur.sn
- Documentation: Voir `DOCUMENTATION_API.md`

---

## ✅ CHECKLIST DÉMARRAGE

- [ ] Node.js 18+ installé
- [ ] MongoDB Atlas créé et URI obtenu
- [ ] Fichier `.env` créé et configuré
- [ ] `npm install` exécuté
- [ ] `npm run seed` exécuté
- [ ] `npm run dev` lance le serveur
- [ ] Test de connexion réussi
- [ ] Test de machines réussi

---

**C'est tout! Votre API ALLOTRACTEUR tourne maintenant! 🚜✨**

Pour déployer en production, consultez `GUIDE_DEPLOIEMENT.md`.
