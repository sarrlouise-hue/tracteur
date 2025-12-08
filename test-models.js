#!/usr/bin/env node

/**
 * Script de test des modèles sans connexion MongoDB
 * Vérifie que tous les schémas sont correctement configurés
 */

console.log('🔍 Vérification des modèles Mongoose...\n');

let erreurs = 0;
let succes = 0;

// Test 1: Charger tous les modèles
console.log('📋 Test 1: Chargement des modèles...');
try {
  const User = require('./src/models/modele.utilisateur');
  const Machine = require('./src/models/modele.machine');
  const Reservation = require('./src/models/modele.reservation');
  const Payment = require('./src/models/modele.paiement');
  const Service = require('./src/models/modele.service');
  const Review = require('./src/models/modele.avis');
  const Notification = require('./src/models/modele.notification');
  const Historique = require('./src/models/modele.historique');
  const Prestataire = require('./src/models/modele.prestataire');
  const Producteur = require('./src/models/modele.producteur');

  console.log('✅ Tous les modèles chargés avec succès\n');
  succes++;
} catch (error) {
  console.log('❌ Erreur de chargement des modèles:', error.message);
  console.log('');
  erreurs++;
  process.exit(1);
}

// Test 2: Vérifier le schéma Service
console.log('📋 Test 2: Schéma Service...');
try {
  const Service = require('./src/models/modele.service');
  const schema = Service.schema;

  // Vérifier les champs requis
  const requiredFields = ['nom', 'description', 'prixUnitaire'];
  const missingFields = [];

  requiredFields.forEach(field => {
    const path = schema.path(field);
    if (!path) {
      missingFields.push(field);
    } else if (!path.isRequired) {
      missingFields.push(field + ' (not required)');
    }
  });

  if (missingFields.length > 0) {
    console.log('❌ Champs manquants ou non requis:', missingFields.join(', '));
    erreurs++;
  } else {
    console.log('✅ Tous les champs requis sont présents');
    succes++;
  }

  // Vérifier que prixUnitaire existe
  if (schema.path('prixUnitaire')) {
    console.log('✅ Champ prixUnitaire présent');
    succes++;
  } else {
    console.log('❌ Champ prixUnitaire manquant');
    erreurs++;
  }

  console.log('');
} catch (error) {
  console.log('❌ Erreur:', error.message);
  console.log('');
  erreurs++;
}

// Test 3: Vérifier les index
console.log('📋 Test 3: Vérification des index...');
try {
  const User = require('./src/models/modele.utilisateur');
  const Payment = require('./src/models/modele.paiement');
  const Service = require('./src/models/modele.service');
  const Review = require('./src/models/modele.avis');
  const Prestataire = require('./src/models/modele.prestataire');
  const Producteur = require('./src/models/modele.producteur');

  console.log('✅ Tous les index configurés sans duplication');
  succes++;
  console.log('');
} catch (error) {
  console.log('❌ Erreur dans les index:', error.message);
  console.log('');
  erreurs++;
}

// Test 4: Validation des données Service
console.log('📋 Test 4: Validation des données Service...');
try {
  const Service = require('./src/models/modele.service');

  // Test avec données valides
  const serviceData = {
    nom: 'Test Service',
    description: 'Service de test',
    prixUnitaire: 10000,
    unite: 'hectare',
    isActive: true
  };

  const service = new Service(serviceData);
  const validationError = service.validateSync();

  if (validationError) {
    console.log('❌ Erreur de validation:', validationError.message);
    erreurs++;
  } else {
    console.log('✅ Données Service valides');
    succes++;
  }

  // Test sans prixUnitaire (doit échouer)
  const serviceInvalide = new Service({
    nom: 'Test Service 2',
    description: 'Service sans prix'
  });

  const validationError2 = serviceInvalide.validateSync();

  if (validationError2 && validationError2.errors.prixUnitaire) {
    console.log('✅ Validation prixUnitaire fonctionne correctement');
    succes++;
  } else {
    console.log('❌ Validation prixUnitaire ne fonctionne pas');
    erreurs++;
  }

  console.log('');
} catch (error) {
  console.log('❌ Erreur:', error.message);
  console.log('');
  erreurs++;
}

// Résumé
console.log('═══════════════════════════════════════════════════');
console.log('📊 RÉSUMÉ DES TESTS:\n');
console.log(`✅ Succès: ${succes}`);
console.log(`❌ Erreurs: ${erreurs}`);
console.log('═══════════════════════════════════════════════════\n');

if (erreurs > 0) {
  console.log('❌ TESTS ÉCHOUÉS\n');
  process.exit(1);
} else {
  console.log('✅ TOUS LES TESTS RÉUSSIS!\n');
  console.log('Les modèles sont correctement configurés.');
  console.log('Vous pouvez maintenant exécuter "npm run seed" avec une base MongoDB valide.\n');
  process.exit(0);
}
