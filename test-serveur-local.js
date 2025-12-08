require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testerServeur() {
  console.log('\n🧪 TEST DU SERVEUR LOCAL ALLOTRACTEUR\n');
  console.log('═'.repeat(60));

  const tests = [
    {
      nom: 'Page d\'accueil (/)',
      url: '/',
      method: 'GET',
      attendu: { success: true }
    },
    {
      nom: 'Health Check (/health)',
      url: '/health',
      method: 'GET',
      attendu: { status: 'OK' }
    },
    {
      nom: 'Liste machines (/api/machines)',
      url: '/api/machines',
      method: 'GET',
      attendu: { success: true }
    },
    {
      nom: 'Liste services (/api/services)',
      url: '/api/services',
      method: 'GET',
      attendu: { success: true }
    },
    {
      nom: 'Liste prestataires (/api/prestataires)',
      url: '/api/prestataires',
      method: 'GET',
      attendu: { success: true }
    },
    {
      nom: 'Route 404 (doit retourner erreur)',
      url: '/route-inexistante',
      method: 'GET',
      attendu: { success: false },
      status: 404
    }
  ];

  let succes = 0;
  let echecs = 0;

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        validateStatus: () => true
      });

      const statusOk = test.status ? response.status === test.status : response.status === 200;
      const dataOk = Object.keys(test.attendu).every(key =>
        response.data[key] === test.attendu[key]
      );

      if (statusOk && dataOk) {
        console.log(`✅ ${test.nom}`);
        console.log(`   Status: ${response.status}`);
        if (test.url === '/') {
          console.log(`   Message: ${response.data.message}`);
          console.log(`   Version: ${response.data.version}`);
          console.log(`   Endpoints disponibles: ${Object.keys(response.data.endpoints).length} groupes`);
        }
        succes++;
      } else {
        console.log(`❌ ${test.nom}`);
        console.log(`   Status: ${response.status} (attendu: ${test.status || 200})`);
        console.log(`   Data:`, JSON.stringify(response.data, null, 2));
        echecs++;
      }
      console.log('');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${test.nom}`);
        console.log(`   Erreur: Serveur non démarré sur ${BASE_URL}`);
        console.log(`   Solution: Lancez "npm start" dans un autre terminal\n`);
        echecs++;
      } else {
        console.log(`❌ ${test.nom}`);
        console.log(`   Erreur: ${error.message}\n`);
        echecs++;
      }
    }
  }

  console.log('═'.repeat(60));
  console.log(`\n📊 RÉSULTAT: ${succes}/${tests.length} tests réussis`);

  if (echecs === 0) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS!');
    console.log('✅ Votre backend est prêt pour le déploiement Vercel\n');
    return 0;
  } else {
    console.log(`\n⚠️  ${echecs} test(s) échoué(s)\n`);
    return 1;
  }
}

if (require.main === module) {
  testerServeur().then(process.exit);
}

module.exports = testerServeur;
