require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/modele.utilisateur');
const Machine = require('../models/modele.machine');
const Reservation = require('../models/modele.reservation');
const Payment = require('../models/modele.paiement');
const Review = require('../models/modele.avis');
const Service = require('../models/modele.service');
const Notification = require('../models/modele.notification');
const Prestataire = require('../models/modele.prestataire');

const logger = require('../utils/utilitaire.logs');
const dbConfig = require('../config/configuration.base-donnees');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('✅ Connecté à MongoDB');
  } catch (error) {
    logger.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  logger.info('🗑️  Nettoyage de la base de données...');

  await User.deleteMany({});
  await Machine.deleteMany({});
  await Reservation.deleteMany({});
  await Payment.deleteMany({});
  await Review.deleteMany({});
  await Service.deleteMany({});
  await Notification.deleteMany({});
  await Prestataire.deleteMany({});

  logger.info('✅ Base de données nettoyée');
}

async function seedUsers() {
  logger.info('👤 Création des utilisateurs...');

  const motDePasseHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      nom: 'ADMIN',
      prenom: 'ALLOTRACTEUR',
      telephone: '221770000000',
      email: 'admin@allotracteur.sn',
      motDePasseHash,
      role: 'admin',
      isActive: true,
      isVerified: true,
      entreprise: 'ALLOTRACTEUR',
      localisation: {
        type: 'Point',
        coordinates: [-17.4467, 14.7167],
        ville: 'Dakar',
        region: 'Dakar',
        adresse: 'Siège ALLOTRACTEUR, Dakar'
      }
    },
    {
      nom: 'Diallo',
      prenom: 'Amadou',
      telephone: '221771234567',
      email: 'amadou.diallo@allotracteur.sn',
      motDePasseHash,
      role: 'producteur',
      isActive: true,
      isVerified: true,
      localisation: {
        type: 'Point',
        coordinates: [-16.9318, 14.7886],
        ville: 'Thiès',
        region: 'Thiès',
        adresse: 'Ferme de Thiès, Route de Dakar Km 12'
      }
    },
    {
      nom: 'Ndiaye',
      prenom: 'Fatou',
      telephone: '221772345678',
      email: 'fatou.ndiaye@allotracteur.sn',
      motDePasseHash,
      role: 'producteur',
      isActive: true,
      isVerified: true,
      localisation: {
        type: 'Point',
        coordinates: [-16.0723, 14.1515],
        ville: 'Kaolack',
        region: 'Kaolack',
        adresse: 'Exploitation agricole Ndiaye'
      }
    },
    {
      nom: 'Sow',
      prenom: 'Moussa',
      telephone: '221773456789',
      email: 'moussa.sow@allotracteur.sn',
      motDePasseHash,
      role: 'prestataire',
      isActive: true,
      isVerified: true,
      entreprise: 'AgriService Thiès',
      localisation: {
        type: 'Point',
        coordinates: [-16.9318, 14.7886],
        ville: 'Thiès',
        region: 'Thiès',
        adresse: 'Zone industrielle Thiès'
      }
    },
    {
      nom: 'Fall',
      prenom: 'Mariama',
      telephone: '221774567890',
      email: 'mariama.fall@allotracteur.sn',
      motDePasseHash,
      role: 'prestataire',
      isActive: true,
      isVerified: true,
      entreprise: 'TracteurService Kaolack',
      localisation: {
        type: 'Point',
        coordinates: [-16.0723, 14.1515],
        ville: 'Kaolack',
        region: 'Kaolack',
        adresse: 'Route de Fatick, Kaolack'
      }
    },
    {
      nom: 'Sy',
      prenom: 'Oumar',
      telephone: '221775678901',
      email: 'oumar.sy@allotracteur.sn',
      motDePasseHash,
      role: 'prestataire',
      isActive: true,
      isVerified: true,
      entreprise: 'MachineAgro Louga',
      localisation: {
        type: 'Point',
        coordinates: [-16.2333, 15.6167],
        ville: 'Louga',
        region: 'Louga',
        adresse: 'Centre ville Louga'
      }
    },
    {
      nom: 'Sarr',
      prenom: 'Aissatou',
      telephone: '221776789012',
      email: 'aissatou.sarr@allotracteur.sn',
      motDePasseHash,
      role: 'producteur',
      isActive: true,
      isVerified: true,
      localisation: {
        type: 'Point',
        coordinates: [-17.0347, 14.7667],
        ville: 'Nguekhokh',
        region: 'Thiès',
        adresse: 'Village Nguekhokh'
      }
    },
    {
      nom: 'Diop',
      prenom: 'Ibrahima',
      telephone: '221777890123',
      email: 'ibrahima.diop@allotracteur.sn',
      motDePasseHash,
      role: 'prestataire',
      isActive: true,
      isVerified: true,
      entreprise: 'AgriMachines Dakar',
      localisation: {
        type: 'Point',
        coordinates: [-17.4467, 14.7167],
        ville: 'Rufisque',
        region: 'Dakar',
        adresse: 'Rufisque, Route de Bargny'
      }
    },
    {
      nom: 'Ba',
      prenom: 'Aminata',
      telephone: '221778901234',
      email: 'aminata.ba@allotracteur.sn',
      motDePasseHash,
      role: 'prestataire',
      isActive: true,
      isVerified: true,
      entreprise: 'ServiceAgri Saint-Louis',
      localisation: {
        type: 'Point',
        coordinates: [-16.4889, 16.0181],
        ville: 'Saint-Louis',
        region: 'Saint-Louis',
        adresse: 'Route de Rosso, Saint-Louis'
      }
    }
  ];

  const createdUsers = await User.insertMany(users);
  logger.info(`✅ ${createdUsers.length} utilisateurs créés`);

  return createdUsers;
}

async function seedPrestataires(users) {
  logger.info('🏢 Création des profils prestataires...');

  const prestataireUsers = users.filter(u => u.role === 'prestataire');

  const prestataires = prestataireUsers.map(user => ({
    userId: user._id,
    description: `Prestataire de services agricoles - ${user.nom} ${user.prenom}`,
    localisation: user.localisation || {
      type: 'Point',
      coordinates: [-17.4467, 14.7167]
    },
    adresse: user.localisation?.adresse || 'Dakar, Sénégal',
    servicesProposes: [],
    machines: [],
    disponibilite: true,
    noteGlobale: 4.5,
    nombreAvis: 0
  }));

  const createdPrestataires = await Prestataire.insertMany(prestataires);
  logger.info(`✅ ${createdPrestataires.length} profils prestataires créés`);

  return createdPrestataires;
}

async function seedMachines(users, prestataires) {
  logger.info('🚜 Création des machines...');

  if (prestataires.length < 3) {
    throw new Error(`❌ Pas assez de prestataires ! Trouvés: ${prestataires.length}, requis: 3 minimum`);
  }

  const machines = [
    {
      nom: 'Tracteur John Deere 5055E',
      type: 'Tracteur',
      marque: 'John Deere',
      modele: '5055E',
      puissance: '55 CV',
      annee: 2020,
      description: 'Tracteur polyvalent idéal pour labour, semis et transport. Parfait pour toutes cultures.',
      prixLocation: 50000,
      disponibilite: true,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/tractors/john-deere-1.jpg',
        'https://res.cloudinary.com/demo/image/upload/v1/tractors/john-deere-2.jpg'
      ],
      prestataireId: prestataires[0]._id
    },
    {
      nom: 'Moissonneuse-batteuse New Holland TC56',
      type: 'Moissonneuse',
      marque: 'New Holland',
      modele: 'TC56',
      puissance: '160 CV',
      annee: 2019,
      description: 'Moissonneuse-batteuse performante pour céréales (mil, maïs, riz).',
      prixLocation: 120000,
      disponibilite: true,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/harvesters/new-holland-1.jpg'
      ],
      prestataireId: prestataires[1]._id
    },
    {
      nom: 'Tracteur Massey Ferguson 385',
      type: 'Tracteur',
      marque: 'Massey Ferguson',
      modele: '385',
      puissance: '85 CV',
      annee: 2021,
      description: 'Tracteur robuste pour gros travaux agricoles. Excellent pour labour profond.',
      prixLocation: 65000,
      disponibilite: true,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/tractors/massey-ferguson-1.jpg'
      ],
      prestataireId: prestataires[2]._id
    },
    {
      nom: 'Charrue à disques 4 socs',
      type: 'Charrue',
      marque: 'Lemken',
      modele: 'Europal 7',
      description: 'Charrue à disques pour labour profond. Compatible avec tracteurs 60-90 CV.',
      prixLocation: 15000,
      disponibilite: true,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/plows/lemken-1.jpg'
      ],
      prestataireId: prestataires[0]._id
    },
    {
      nom: 'Semoir pneumatique 12 rangs',
      type: 'Semoir',
      marque: 'Kuhn',
      modele: 'Planter 3',
      description: 'Semoir de précision pour arachide, maïs, mil. Espacement réglable.',
      prixLocation: 20000,
      disponibilite: true,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/seeders/kuhn-1.jpg'
      ],
      prestataireId: prestataires[1]._id
    },
    {
      nom: 'Pulvérisateur trainé 1000L',
      type: 'Autre',
      marque: 'Hardi',
      modele: 'Navigator 3000',
      description: 'Pulvérisateur pour traitement phytosanitaire. Rampe 12m.',
      prixLocation: 25000,
      disponibilite: false,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/sprayers/hardi-1.jpg'
      ],
      prestataireId: prestataires[2]._id
    },
    {
      nom: 'Tracteur Kubota M7040',
      type: 'Tracteur',
      marque: 'Kubota',
      modele: 'M7040',
      puissance: '70 CV',
      annee: 2022,
      description: 'Tracteur compact économique en carburant. Idéal petites exploitations.',
      prixLocation: 45000,
      disponibilite: true,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/tractors/kubota-1.jpg'
      ],
      prestataireId: prestataires[0]._id
    },
    {
      nom: 'Remorque agricole 8 tonnes',
      type: 'Autre',
      marque: 'Brimont',
      modele: 'BB 8040',
      description: 'Remorque benne basculante pour transport récoltes et matériaux.',
      prixLocation: 10000,
      disponibilite: true,
      images: [
        'https://res.cloudinary.com/demo/image/upload/v1/trailers/brimont-1.jpg'
      ],
      prestataireId: prestataires[1]._id
    }
  ];

  const createdMachines = await Machine.insertMany(machines);
  logger.info(`✅ ${createdMachines.length} machines créées`);

  return createdMachines;
}

async function seedServices(users) {
  logger.info('🛠️  Création des services...');

  const prestataires = users.filter(u => u.role === 'prestataire');

  const services = [
    {
      nom: 'Labour profond',
      description: 'Labour profond (25-30cm) pour préparation des sols avant semis',
      prixUnitaire: 25000,
      unite: 'hectare',
      isActive: true
    },
    {
      nom: 'Semis mécanisé',
      description: 'Semis de précision pour arachide, mil, maïs avec semoir pneumatique',
      prixUnitaire: 15000,
      unite: 'hectare',
      isActive: true
    },
    {
      nom: 'Moisson céréales',
      description: 'Récolte mécanique de céréales (mil, maïs, riz, blé)',
      prixUnitaire: 35000,
      unite: 'hectare',
      isActive: true
    },
    {
      nom: 'Transport agricole',
      description: 'Transport de récoltes et matériaux avec remorque 8 tonnes',
      prixUnitaire: 5000,
      unite: 'journee',
      isActive: true
    },
    {
      nom: 'Pulvérisation phytosanitaire',
      description: 'Traitement phytosanitaire des cultures (herbicides, insecticides)',
      prixUnitaire: 12000,
      unite: 'hectare',
      isActive: true
    }
  ];

  const createdServices = await Service.insertMany(services);
  logger.info(`✅ ${createdServices.length} services créés`);

  return createdServices;
}

async function seedReservations(users, machines, prestataires, services) {
  logger.info('📅 Création des réservations...');

  const producteurs = users.filter(u => u.role === 'producteur');

  const reservations = [
    {
      producteurId: producteurs[0]._id,
      prestataireId: prestataires[0]._id,
      tractorId: machines[0]._id,
      serviceId: services[0]._id,
      date: new Date('2025-02-01'),
      heure: '08:00',
      duree: 4,
      superficie: 10,
      cout: 250000,
      etat: 'confirme',
      adresseTravail: 'Ferme de Thiès, Route de Dakar Km 12',
      notes: 'Labour de 10 hectares pour préparation semis arachide',
      localisation: {
        type: 'Point',
        coordinates: [-16.9335, 14.7886]
      }
    },
    {
      producteurId: producteurs[1]._id,
      prestataireId: prestataires[1]._id,
      tractorId: machines[1]._id,
      serviceId: services[2]._id,
      date: new Date('2025-02-10'),
      heure: '07:00',
      duree: 2,
      superficie: 15,
      cout: 525000,
      etat: 'confirme',
      adresseTravail: 'Exploitation agricole Ndiaye, Kaolack',
      notes: 'Moisson de 15 hectares de maïs',
      localisation: {
        type: 'Point',
        coordinates: [-16.0723, 14.1515]
      }
    },
    {
      producteurId: producteurs[0]._id,
      prestataireId: prestataires[2]._id,
      tractorId: machines[2]._id,
      serviceId: services[1]._id,
      date: new Date('2025-02-20'),
      heure: '09:00',
      duree: 2,
      superficie: 8,
      cout: 120000,
      etat: 'en_attente',
      adresseTravail: 'Ferme de Thiès, Route de Dakar Km 12',
      notes: 'Semis mécanisé de mil',
      localisation: {
        type: 'Point',
        coordinates: [-16.9335, 14.7886]
      }
    },
    {
      producteurId: producteurs[2]._id,
      prestataireId: prestataires[0]._id,
      tractorId: machines[3]._id,
      serviceId: services[0]._id,
      date: new Date('2025-01-25'),
      heure: '06:30',
      duree: 3,
      superficie: 5,
      cout: 125000,
      etat: 'termine',
      adresseTravail: 'Champs Sarr, Village Nguekhokh',
      notes: 'Labour terminé avec succès',
      localisation: {
        type: 'Point',
        coordinates: [-17.0608, 14.5115]
      }
    }
  ];

  const createdReservations = await Reservation.insertMany(reservations);
  logger.info(`✅ ${createdReservations.length} réservations créées`);

  return createdReservations;
}

async function seedPayments(reservations) {
  logger.info('💳 Création des paiements...');

  const reservationsConfirmees = reservations.filter(r => r.etat === 'confirme' || r.etat === 'termine');

  const payments = reservationsConfirmees.map(reservation => ({
    reservationId: reservation._id,
    montant: reservation.cout,
    moyen: ['wave', 'orange_money', 'free_money'][Math.floor(Math.random() * 3)],
    status: 'success',
    referencePaiement: `PAY-2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    transactionId: `PAYTECH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    datePaiement: new Date()
  }));

  const createdPayments = await Payment.insertMany(payments);
  logger.info(`✅ ${createdPayments.length} paiements créés`);

  return createdPayments;
}

async function seedReviews(users, reservations, prestataires) {
  logger.info('⭐ Création des avis...');

  const producteurs = users.filter(u => u.role === 'producteur');
  const reservationsTerminees = reservations.filter(r => r.etat === 'termine' || r.etat === 'confirme');

  if (reservationsTerminees.length === 0) {
    logger.info('⚠️  Aucune réservation terminée, pas d\'avis créés');
    return [];
  }

  const reviews = reservationsTerminees.slice(0, 3).map((reservation, index) => ({
    reservationId: reservation._id,
    prestataireId: reservation.prestataireId,
    producteurId: reservation.producteurId,
    note: [5, 5, 4][index] || 4,
    commentaire: [
      'Excellent service! Très performant et économique. Le prestataire est professionnel et ponctuel. Je recommande vivement!',
      'Service très efficace. Travail impeccable réalisé dans les temps!',
      'Bon service, quelques petits soucis résolus rapidement. Prix correct.'
    ][index],
    qualiteService: [5, 5, 4][index] || 4,
    ponctualite: [5, 5, 4][index] || 4,
    professionnalisme: [5, 5, 4][index] || 4,
    isVisible: true
  }));

  const createdReviews = await Review.insertMany(reviews);
  logger.info(`✅ ${createdReviews.length} avis créés`);

  return createdReviews;
}

async function seedNotifications(users, reservations) {
  logger.info('🔔 Création des notifications...');

  const producteurs = users.filter(u => u.role === 'producteur');
  const prestataires = users.filter(u => u.role === 'prestataire');

  const notifications = [
    {
      userId: producteurs[0]._id,
      type: 'confirmation',
      titre: 'Réservation confirmée',
      message: 'Votre réservation a été confirmée avec succès!',
      lien: `/reservations/${reservations[0]?._id}`,
      lu: true
    },
    {
      userId: prestataires[0]._id,
      type: 'reservation',
      titre: 'Nouvelle réservation',
      message: 'Vous avez reçu une nouvelle demande de réservation',
      lien: `/reservations/${reservations[0]?._id}`,
      lu: true
    },
    {
      userId: producteurs[0]._id,
      type: 'paiement',
      titre: 'Paiement réussi',
      message: 'Votre paiement a été validé avec succès',
      lien: '/mes-reservations',
      lu: false
    }
  ];

  const createdNotifications = await Notification.insertMany(notifications);
  logger.info(`✅ ${createdNotifications.length} notifications créées`);

  return createdNotifications;
}

async function seed() {
  try {
    await connectDB();

    if (process.argv.includes('--clear')) {
      await clearDatabase();
      logger.info('✅ Base de données vidée');
      process.exit(0);
    }

    await clearDatabase();

    logger.info('🌱 Démarrage du seeding...');

    const users = await seedUsers();
    const prestataires = await seedPrestataires(users);
    const machines = await seedMachines(users, prestataires);
    const services = await seedServices(users);
    const reservations = await seedReservations(users, machines, prestataires, services);
    const payments = await seedPayments(reservations);
    const reviews = await seedReviews(users, reservations, prestataires);
    const notifications = await seedNotifications(users, reservations);

    logger.info('');
    logger.info('🎉 SEEDING TERMINÉ AVEC SUCCÈS!');
    logger.info('');
    logger.info('📊 Statistiques:');
    logger.info(`   - ${users.length} utilisateurs`);
    logger.info(`   - ${prestataires.length} prestataires`);
    logger.info(`   - ${machines.length} machines`);
    logger.info(`   - ${services.length} services`);
    logger.info(`   - ${reservations.length} réservations`);
    logger.info(`   - ${payments.length} paiements`);
    logger.info(`   - ${reviews.length} avis`);
    logger.info(`   - ${notifications.length} notifications`);
    logger.info('');
    logger.info('🔑 Compte test:');
    logger.info('   📧 Email: amadou.diallo@allotracteur.sn');
    logger.info('   📞 Tel: 221771234567');
    logger.info('   🔒 MDP: password123');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Erreur seeding:', error);
    process.exit(1);
  }
}

seed();
