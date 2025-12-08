# Guide de Déploiement Vercel - ALLOTRACTEUR API

## Configuration Effectuée

Le projet est maintenant configuré pour le déploiement sur Vercel.

### Fichiers Créés

1. **vercel.json** - Configuration du déploiement
2. **api/index.js** - Point d'entrée pour Vercel
3. **.vercelignore** - Fichiers à exclure du déploiement

### Dépendances Mises à Jour

Toutes les dépendances dépréciées ont été corrigées:
- `multer` 1.4.5 → 2.0.2
- `supertest` 6.3.3 → 7.1.4
- `cloudinary` 1.41.0 → 2.8.0
- `superagent` ajouté en 10.2.3
- Node.js 18.x (version stable pour Vercel)

## Variables d'Environnement Requises

Configurez ces variables dans Vercel Dashboard:

### Base de Données
- `MONGO_URI` - URI de connexion MongoDB Atlas

### JWT & Sécurité
- `JWT_SECRET` - Secret pour les tokens JWT
- `JWT_EXPIRE` - Durée de validité des tokens

### Email (Nodemailer)
- `EMAIL_HOST` - Hôte SMTP
- `EMAIL_PORT` - Port SMTP
- `EMAIL_USER` - Utilisateur email
- `EMAIL_PASSWORD` - Mot de passe email
- `EMAIL_FROM` - Adresse expéditeur

### SMS (Twilio)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

### Images (Cloudinary)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Paiements (PayTech)
- `PAYTECH_API_KEY`
- `PAYTECH_API_SECRET`

### Configuration
- `NODE_ENV=production`
- `PORT=3000`
- `CORS_ORIGIN` - URL de votre frontend

## Déploiement

### Depuis GitHub

1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement la configuration
3. Ajoutez les variables d'environnement
4. Déployez

### Depuis CLI Vercel

```bash
npm install -g vercel
vercel login
vercel
```

## Endpoints de l'API

Une fois déployé, votre API sera accessible à:
```
https://votre-projet.vercel.app/
```

### Health Check
```
GET https://votre-projet.vercel.app/health
```

### Toutes les routes API
```
/api/auth/*
/api/admin/*
/api/producteur/*
/api/prestataire/*
/api/prestataires/*
/api/machines/*
/api/services/*
/api/reservations/*
/api/payments/*
/api/avis/*
/api/recherche/*
/api/historique/*
/api/notifications/*
/api/users/*
```

## Notes Importantes

1. Vercel utilise des fonctions serverless, donc:
   - Pas de connexions persistentes (WebSocket non supporté)
   - Timeout de 10 secondes par requête (plan gratuit)
   - 12 secondes pour les plans payants

2. La connexion MongoDB est optimisée pour le serverless avec réutilisation

3. Les logs sont disponibles dans Vercel Dashboard

## Troubleshooting

### Erreur de connexion MongoDB
Vérifiez que l'IP de Vercel est autorisée dans MongoDB Atlas (0.0.0.0/0 pour autoriser toutes les IPs)

### Erreur 404
Vérifiez que `vercel.json` est bien à la racine du projet

### Timeout
Optimisez vos requêtes MongoDB ou passez à un plan Vercel supérieur

## Support

Pour plus d'informations sur Vercel:
- https://vercel.com/docs
- https://vercel.com/docs/functions/serverless-functions
