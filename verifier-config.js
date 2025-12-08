#!/usr/bin/env node

/**
 * 🔍 Script de Vérification de Configuration
 * Vérifie que toutes les variables d'environnement sont correctement configurées
 * Usage: node verifier-config.js
 */

require('dotenv').config();

const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

console.log('\n' + chalk.bold(chalk.blue('🔍 VÉRIFICATION DE LA CONFIGURATION ALLOTRACTEUR\n')));

let erreurs = 0;
let avertissements = 0;
let succes = 0;

// Variables obligatoires
const variablesObligatoires = [
  { name: 'MONGO_URI', description: 'URI MongoDB Atlas', exemple: 'mongodb+srv://user:pass@cluster.mongodb.net/db' },
  { name: 'JWT_SECRET', description: 'Clé secrète JWT', minLength: 32 },
  { name: 'CLOUDINARY_CLOUD_NAME', description: 'Nom du cloud Cloudinary' },
  { name: 'CLOUDINARY_API_KEY', description: 'Clé API Cloudinary' },
  { name: 'CLOUDINARY_API_SECRET', description: 'Secret API Cloudinary' },
  { name: 'PAYTECH_API_KEY', description: 'Clé API PayTech' },
  { name: 'PAYTECH_API_SECRET', description: 'Secret API PayTech' }
];

// Variables recommandées
const variablesRecommandees = [
  { name: 'EMAIL_USER', description: 'Email Gmail pour envoi' },
  { name: 'EMAIL_PASSWORD', description: 'Mot de passe app Gmail' },
  { name: 'PAYTECH_IPN_URL', description: 'URL webhook PayTech' },
  { name: 'PAYTECH_SUCCESS_URL', description: 'URL succès paiement' },
  { name: 'PAYTECH_CANCEL_URL', description: 'URL annulation paiement' }
];

// Variables optionnelles
const variablesOptionnelles = [
  { name: 'SMS_API_KEY', description: 'Clé API SMS (Twilio)' },
  { name: 'SMS_API_SECRET', description: 'Secret API SMS' }
];

console.log(chalk.bold('📋 VARIABLES OBLIGATOIRES:\n'));

variablesObligatoires.forEach(variable => {
  const valeur = process.env[variable.name];

  if (!valeur || valeur === 'your_' || valeur === 'votre_' || valeur.includes('changez_moi')) {
    console.log(chalk.red(`❌ ${variable.name}`));
    console.log(`   ${chalk.red('→')} ${variable.description}`);
    if (variable.exemple) {
      console.log(`   ${chalk.yellow('Exemple:')} ${variable.exemple}`);
    }
    console.log('');
    erreurs++;
  } else if (variable.minLength && valeur.length < variable.minLength) {
    console.log(chalk.yellow(`⚠️  ${variable.name}`));
    console.log(`   ${chalk.yellow('→')} ${variable.description}`);
    console.log(`   ${chalk.yellow('⚠️  Trop court!')} Minimum ${variable.minLength} caractères, actuellement ${valeur.length}`);
    console.log('');
    avertissements++;
  } else {
    console.log(chalk.green(`✅ ${variable.name}`));
    console.log(`   ${chalk.green('→')} ${variable.description} (configuré)`);
    console.log('');
    succes++;
  }
});

console.log(chalk.bold('📋 VARIABLES RECOMMANDÉES:\n'));

variablesRecommandees.forEach(variable => {
  const valeur = process.env[variable.name];

  if (!valeur || valeur === 'your_' || valeur === 'votre_') {
    console.log(chalk.yellow(`⚠️  ${variable.name}`));
    console.log(`   ${chalk.yellow('→')} ${variable.description} (non configuré)`);
    console.log('');
    avertissements++;
  } else {
    console.log(chalk.green(`✅ ${variable.name}`));
    console.log(`   ${chalk.green('→')} ${variable.description} (configuré)`);
    console.log('');
    succes++;
  }
});

console.log(chalk.bold('📋 VARIABLES OPTIONNELLES:\n'));

variablesOptionnelles.forEach(variable => {
  const valeur = process.env[variable.name];

  if (!valeur || valeur === 'your_' || valeur === 'votre_') {
    console.log(`⚪ ${variable.name}`);
    console.log(`   → ${variable.description} (optionnel)`);
    console.log('');
  } else {
    console.log(chalk.green(`✅ ${variable.name}`));
    console.log(`   ${chalk.green('→')} ${variable.description} (configuré)`);
    console.log('');
    succes++;
  }
});

// Vérifications spécifiques
console.log(chalk.bold('🔍 VÉRIFICATIONS SPÉCIFIQUES:\n'));

// MongoDB URI
if (process.env.MONGO_URI) {
  if (process.env.MONGO_URI.includes('mongodb+srv://')) {
    console.log(chalk.green('✅ MongoDB URI format valide (SRV)'));
  } else if (process.env.MONGO_URI.includes('mongodb://')) {
    console.log(chalk.green('✅ MongoDB URI format valide'));
  } else {
    console.log(chalk.red('❌ MongoDB URI format invalide'));
    console.log(chalk.yellow('   → Doit commencer par mongodb:// ou mongodb+srv://'));
    erreurs++;
  }
}

// JWT Secret
if (process.env.JWT_SECRET) {
  const longueur = process.env.JWT_SECRET.length;
  if (longueur >= 64) {
    console.log(chalk.green(`✅ JWT_SECRET longueur excellente (${longueur} caractères)`));
  } else if (longueur >= 32) {
    console.log(chalk.yellow(`⚠️  JWT_SECRET longueur acceptable (${longueur} caractères, recommandé: 64+)`));
    avertissements++;
  } else {
    console.log(chalk.red(`❌ JWT_SECRET trop court (${longueur} caractères, minimum: 32)`));
    erreurs++;
  }
}

// Node Environment
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`📊 NODE_ENV: ${nodeEnv}`);

if (nodeEnv === 'production') {
  console.log(chalk.bold(chalk.yellow('\n⚠️  MODE PRODUCTION DÉTECTÉ - Vérifications supplémentaires:\n')));

  // En production, certaines variables DOIVENT être sécurisées
  if (process.env.CORS_ORIGIN === '*') {
    console.log(chalk.red('❌ CORS_ORIGIN est "*" en production (insécurisé!)'));
    console.log(chalk.yellow('   → Définissez votre domaine: https://allotracteur.sn'));
    erreurs++;
  } else {
    console.log(chalk.green('✅ CORS_ORIGIN configuré pour production'));
  }

  if (process.env.PAYTECH_ENV !== 'production') {
    console.log(chalk.yellow('⚠️  PAYTECH_ENV n\'est pas "production"'));
    avertissements++;
  } else {
    console.log(chalk.green('✅ PAYTECH_ENV en mode production'));
  }

  if (process.env.JWT_SECRET && (
    process.env.JWT_SECRET.includes('changez') ||
    process.env.JWT_SECRET.includes('secret_key_2024')
  )) {
    console.log(chalk.red('❌ JWT_SECRET utilise une valeur d\'exemple en production!'));
    console.log(chalk.yellow('   → Générez une nouvelle clé: openssl rand -base64 64'));
    erreurs++;
  }
}

// RÉSUMÉ
console.log('\n' + chalk.bold('═══════════════════════════════════════════════════\n'));
console.log(chalk.bold('📊 RÉSUMÉ:\n'));
console.log(chalk.green(`✅ Succès: ${succes}`));
console.log(chalk.yellow(`⚠️  Avertissements: ${avertissements}`));
console.log(chalk.red(`❌ Erreurs: ${erreurs}`));
console.log('\n' + chalk.bold('═══════════════════════════════════════════════════\n'));

if (erreurs > 0) {
  console.log(chalk.red(chalk.bold('🚨 CONFIGURATION INCOMPLÈTE!\n')));
  console.log(chalk.yellow('Corrigez les erreurs ci-dessus avant de lancer l\'API.\n'));
  console.log(chalk.blue('📚 Aide:'));
  console.log(chalk.blue('   - Guide complet: GUIDE_DEPLOIEMENT.md'));
  console.log(chalk.blue('   - Démarrage rapide: DEMARRAGE_RAPIDE.md\n'));
  process.exit(1);
} else if (avertissements > 0) {
  console.log(chalk.yellow(chalk.bold('⚠️  CONFIGURATION AVEC AVERTISSEMENTS\n')));
  console.log(chalk.yellow('Vous pouvez lancer l\'API, mais certaines fonctionnalités'));
  console.log(chalk.yellow('peuvent ne pas fonctionner correctement.\n'));
  console.log(chalk.blue('💡 Consultez GUIDE_DEPLOIEMENT.md pour optimiser.\n'));
  process.exit(0);
} else {
  console.log(chalk.green(chalk.bold('🎉 CONFIGURATION PARFAITE!\n')));
  console.log(chalk.green('Votre API est prête à être lancée.\n'));
  console.log(chalk.blue('🚀 Commandes:'));
  console.log(chalk.blue('   - Développement: npm run dev'));
  console.log(chalk.blue('   - Production: npm start'));
  console.log(chalk.blue('   - Données test: npm run seed\n'));
  process.exit(0);
}
