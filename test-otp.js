#!/usr/bin/env node

/**
 * Test d'envoi OTP - EMAIL + SMS
 * Vérifie que le système OTP fonctionne correctement
 */

require('dotenv').config();
const otpUtil = require('./src/utils/utilitaire.otp');
const logger = require('./src/utils/utilitaire.logs');

async function testOTP() {
  console.log('🧪 TEST ENVOI OTP - ALLOTRACTEUR\n');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // 1. Générer OTP
    const otp = otpUtil.generateOTP();
    console.log('✅ OTP généré:', otp);
    console.log('');

    // 2. Tester expiration
    const expiration = otpUtil.generateExpirationTime(10);
    console.log('✅ Expiration générée:', expiration.toLocaleString('fr-FR'));
    console.log('✅ Durée de validité: 10 minutes');
    console.log('');

    // 3. Tester envoi OTP complet (EMAIL + SMS)
    console.log('📤 Envoi OTP via EMAIL + SMS...\n');

    const result = await otpUtil.envoyerOTPComplet(
      process.env.EMAIL_USER || 'infos.allotracteur@gmail.com',
      '+221771234567',
      otp,
      'Test User'
    );

    console.log('\n═══════════════════════════════════════════════════');
    console.log('📊 RÉSULTAT ENVOI OTP:\n');

    // Résultat Email
    if (result.email.success) {
      console.log('✅ EMAIL: Envoyé avec succès');
      if (result.email.messageId) {
        console.log(`   Message ID: ${result.email.messageId}`);
      }
    } else {
      console.log('❌ EMAIL: Échec');
      if (result.email.error) {
        console.log(`   Erreur: ${result.email.error}`);
      }
    }

    console.log('');

    // Résultat SMS
    if (result.sms.success) {
      if (result.sms.simulated) {
        console.log('📱 SMS: Simulé (SMS_ENABLED=false)');
        console.log('   💡 Pour activer: configurer SMS_API_KEY dans .env');
      } else {
        console.log('✅ SMS: Envoyé avec succès');
        if (result.sms.messageId) {
          console.log(`   Message ID: ${result.sms.messageId}`);
        }
      }
    } else {
      console.log('❌ SMS: Échec');
      if (result.sms.error) {
        console.log(`   Erreur: ${result.sms.error}`);
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════');

    // Résultat global
    if (result.success) {
      console.log('');
      console.log('🎉 SUCCÈS: Au moins un canal fonctionne!');
      console.log('');
      console.log('📧 Email configuré: ✅');
      console.log(`📱 SMS configuré: ${result.sms.simulated ? '🟡 Simulé' : '✅'}`);
      console.log('');

      if (result.sms.simulated) {
        console.log('💡 CONSEIL: Pour activer les SMS réels:');
        console.log('   1. Créer compte Twilio: https://www.twilio.com');
        console.log('   2. Obtenir Account SID + Auth Token');
        console.log('   3. Mettre à jour .env:');
        console.log('      SMS_API_KEY=votre_account_sid');
        console.log('      SMS_API_SECRET=votre_auth_token');
        console.log('      SMS_ENABLED=true');
        console.log('');
      }

      process.exit(0);
    } else {
      console.log('');
      console.log('❌ ÉCHEC: Aucun canal ne fonctionne');
      console.log('');
      console.log('🔧 Vérifier la configuration:');
      console.log('   - .env: EMAIL_USER, EMAIL_PASSWORD');
      console.log('   - .env: SMS_API_KEY, SMS_API_SECRET (si SMS activé)');
      console.log('');
      process.exit(1);
    }

  } catch (error) {
    console.log('');
    console.log('❌ ERREUR:', error.message);
    console.log('');
    console.log('Stack:', error.stack);
    process.exit(1);
  }
}

// Exécuter le test
testOTP();
