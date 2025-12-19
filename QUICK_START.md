# 🏥 PulseAI Dashboard React - Guide de Démarrage Rapide

## ✅ Ce qui a été créé

Un dashboard complet avec :

### 🎯 Architecture
- **Frontend** : React 18 + Vite
- **Backend** : Supabase (Auth + PostgreSQL)
- **Routing** : React Router v6
- **Charts** : Recharts
- **Styling** : CSS Modules custom

### 📁 Structure du projet

```
dashboard-react/
├── src/
│   ├── components/
│   │   ├── Analytics/          # Graphiques et statistiques
│   │   ├── HospitalInfo/       # Infos hôpital
│   │   ├── ResourcesManager/   # Gestion lits/médecins
│   │   └── ServicesManager/    # Gestion services médicaux
│   ├── contexts/
│   │   └── AuthContext.jsx     # Contexte auth global
│   ├── pages/
│   │   ├── Auth/              # Login/Signup
│   │   └── Dashboard/         # Page principale
│   ├── services/              # Services API
│   │   ├── auth.service.js
│   │   ├── hospital.service.js
│   │   └── service.service.js
│   ├── config/                # Config Supabase
│   ├── lib/                   # Utilitaires
│   └── styles/                # CSS globaux
├── supabase/
│   └── schema.sql             # Schéma BDD complet
├── package.json
├── vite.config.js
└── README.md
```

### 🗄️ Base de données

4 tables principales :

1. **hospitals** - Données statiques
   - Identité, localisation, services offerts

2. **hospital_resources** - Données dynamiques
   - Lits, médecins, personnel (historisé)

3. **hospital_services** - Services médicaux
   - Files d'attente, temps d'attente, disponibilité

4. **service_history** - Historique temporel
   - Séries temporelles pour analytics

### 🔐 Sécurité
- Row Level Security (RLS) activé
- Chaque hôpital voit uniquement ses données
- Authentification Supabase sécurisée

## 🚀 Pour démarrer

### 1. Installer les dépendances

```bash
cd dashboard-react
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Dans SQL Editor, exécutez `supabase/schema.sql`
3. Récupérez URL et anon key
4. Créez `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

### 3. Lancer en dev

```bash
npm run dev
```

Ouvrez `http://localhost:3000`

### 4. Tester

1. Créez un compte hôpital via `/signup`
2. Autorisez la géolocalisation
3. Sélectionnez les services offerts
4. Explorez le dashboard !

## 📋 Fonctionnalités implémentées

### ✅ Inscription hôpital
- Formulaire complet multi-étapes
- Géolocalisation automatique
- Sélection des services
- Validation complète

### ✅ Gestion des ressources
- Lits totaux/disponibles
- Médecins totaux/disponibles
- Personnel de garde
- Taux d'occupation automatique
- Historisation complète

### ✅ Gestion des services
- Carte par service
- File d'attente
- Temps d'attente (moyen/max)
- Statuts : disponible, occupé, complet, fermé
- Activation/désactivation

### ✅ Analytics
- Graphiques interactifs (Recharts)
- Évolution taux d'occupation
- Historique des lits
- Médecins disponibles
- Périodes : 1, 7, 30, 90 jours

### ✅ Informations hôpital
- Affichage complet
- Modification des infos
- Protection des données sensibles

## 🎨 Interface

- Design moderne et épuré
- Responsive (mobile-first)
- Navigation intuitive par onglets
- Feedback utilisateur (alerts)
- Loading states

## 🔌 Intégration avec PulseAI

### Flux de données

```
Hôpital Dashboard → Supabase → Application Mobile PulseAI
                      ↓
                  Historique
                      ↓
           Modèle de Recommandation
```

### API publique (pour app mobile)

Les données suivantes sont accessibles en lecture publique :
- Liste des hôpitaux
- Localisation GPS
- Services offerts
- Disponibilité actuelle

## 📦 Build & Déploiement

### Build production

```bash
npm run build
```

Le dossier `dist/` contient l'app prête pour production.

### Déploiement Vercel (recommandé)

```bash
npm install -g vercel
vercel
```

Voir `DEPLOYMENT.md` pour les détails complets.

## 🐛 Résolution problèmes courants

### Erreur "Supabase is not defined"
→ Vérifiez `.env` ou `src/config/supabase.config.js`

### Tables non créées
→ Exécutez `supabase/schema.sql` dans SQL Editor

### Données non visibles
→ Vérifiez les policies RLS dans Supabase

### Build fail
→ Vérifiez que toutes les dépendances sont installées

## 📚 Technologies utilisées

- React 18.2
- React Router DOM 6.21
- Supabase JS 2.39
- Recharts 2.10
- date-fns 3.0
- Lucide React (icons)
- Vite 5.0

## 🎯 Prochaines étapes

### Améliorations possibles

1. **Notifications push** - Alerter quand un service est saturé
2. **Export de données** - Exporter l'historique en CSV/Excel
3. **Gestion multi-utilisateurs** - Plusieurs comptes par hôpital
4. **Horaires d'ouverture** - Gestion fine des horaires par service
5. **Photos** - Upload de photos de l'hôpital
6. **Messagerie** - Communication avec les patients
7. **Statistiques avancées** - ML pour prédiction d'affluence

### Intégrations

- **Google Maps** - Carte interactive
- **Twilio** - SMS aux patients
- **WhatsApp Business** - Support client
- **Stripe** - Paiements (si nécessaire)

## 📞 Support

Pour toute question :
- Consultez `README.md` détaillé
- Consultez `DEPLOYMENT.md` pour le déploiement
- Vérifiez la console navigateur
- Vérifiez les logs Supabase

## 🎉 Félicitations !

Vous avez maintenant un dashboard hospitalier complet et professionnel !

Le système est conçu pour :
- ✅ Être simple à utiliser
- ✅ Collecter des données fiables
- ✅ Alimenter l'application mobile
- ✅ Offrir des analytics utiles
- ✅ Évoluer facilement

**Bon courage avec PulseAI ! 🚀**
