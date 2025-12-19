# PulseAI Dashboard React

Dashboard web complet pour la gestion hospitalière, construit avec React et Supabase.

## 🎯 Vue d'ensemble

Le Dashboard PulseAI permet aux hôpitaux de :
- **S'inscrire** et créer leur profil hospitalier
- **Gérer leurs ressources** (lits, médecins, personnel)
- **Gérer leurs services** (urgences, maternité, chirurgie, etc.)
- **Suivre les files d'attente** et temps d'attente
- **Visualiser les analytics** et l'historique des données
- **Alimenter l'application mobile** PulseAI avec des données temps réel

## 🏗️ Architecture

### Frontend
- **React 18** - Framework UI
- **React Router** - Navigation
- **Recharts** - Graphiques et visualisations
- **Vite** - Build tool rapide

### Backend
- **Supabase** - Backend as a Service
  - Authentication
  - Base de données PostgreSQL
  - Row Level Security (RLS)
  - Real-time subscriptions

## 📋 Prérequis

- Node.js 18+ et npm
- Un compte Supabase (gratuit)

## 🚀 Installation

### 1. Cloner et installer les dépendances

```bash
cd dashboard-react
npm install
```

### 2. Configuration Supabase

#### A. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `Project URL` et `anon public key`

#### B. Exécuter le schéma de base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Copiez le contenu de `supabase/schema.sql`
3. Collez et exécutez le script
4. Vérifiez qu'il n'y a pas d'erreurs

#### C. Configurer les variables d'environnement

Créez un fichier `.env` à la racine :

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_ici
```

Ou modifiez directement `src/config/supabase.config.js` (non recommandé pour production).

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📊 Structure de la base de données

### Tables principales

#### `hospitals`
Données statiques des hôpitaux :
- Identité (nom, email, téléphone)
- Localisation GPS (latitude, longitude)
- Classification (type, niveau)
- Services offerts

#### `hospital_resources`
Données dynamiques des ressources :
- Lits totaux / disponibles
- Médecins totaux / disponibles
- Personnel de garde
- **Historisé** avec timestamps

#### `hospital_services`
Gestion des services médicaux :
- Type de service (urgences, maternité, etc.)
- Statut (actif/inactif)
- File d'attente
- Temps d'attente (moyen, max)
- Disponibilité (available, busy, full, closed)

#### `service_history`
Historique temporel des services :
- Snapshots horodatés
- Évolution des files d'attente
- Séries temporelles pour analytics

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS :
- Les hôpitaux ne voient que **leurs propres données**
- Les données publiques sont accessibles en lecture (pour l'app mobile)
- Insertion/modification uniquement pour les propriétaires

### Authentification

- **Supabase Auth** gère l'authentification
- Email + mot de passe
- Sessions sécurisées avec JWT

## 📱 Fonctionnalités

### 1. Inscription Hôpital
- Formulaire complet avec :
  - Informations de base
  - Type et niveau
  - Géolocalisation automatique
  - Sélection des services offerts

### 2. Gestion des Ressources
- Mise à jour en temps réel
- Lits totaux / disponibles
- Médecins disponibles
- Personnel de garde
- Calcul automatique du taux d'occupation

### 3. Gestion des Services
- Carte par service offert
- File d'attente
- Temps d'attente (moyen et max)
- Statut de disponibilité
- Activation/désactivation

### 4. Analytics
- Graphiques interactifs
- Évolution du taux d'occupation
- Historique des lits disponibles
- Médecins disponibles dans le temps
- Périodes d'analyse configurables (1, 7, 30, 90 jours)

### 5. Informations Hôpital
- Visualisation des infos
- Modification des données générales

## 🎨 Design

- Interface moderne et responsive
- Design system cohérent
- Mobile-first
- Accessibilité

## 🔄 Flux de données

```
1. Hôpital se connecte
2. Hôpital met à jour ressources/services
3. Données enregistrées dans Supabase
4. Historique conservé (jamais écrasé)
5. App mobile PulseAI récupère les données
6. Modèle de recommandation utilise l'historique
```

## 🌐 Déploiement

### Option 1: Vercel (Recommandé)

```bash
npm install -g vercel
vercel
```

### Option 2: Netlify

```bash
npm run build
# Uploadez le dossier dist/
```

### Option 3: Build manuel

```bash
npm run build
# Servez le dossier dist/ avec nginx ou autre
```

### Variables d'environnement en production

N'oubliez pas de configurer les variables d'environnement sur votre plateforme :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 Scripts disponibles

```bash
npm run dev        # Lancer en développement
npm run build      # Build pour production
npm run preview    # Prévisualiser le build
npm run lint       # Linter le code
```

## 🐛 Résolution de problèmes

### Erreur de connexion Supabase
- Vérifiez vos variables d'environnement
- Vérifiez que le schéma SQL a été exécuté
- Vérifiez les policies RLS

### Erreur d'authentification
- Vérifiez que l'email n'est pas déjà utilisé
- Mot de passe minimum 6 caractères
- Vérifiez les logs Supabase

### Données non affichées
- Vérifiez les policies RLS
- Vérifiez la console navigateur
- Vérifiez les logs Supabase

## 📚 Documentation API

### Services disponibles

#### `authService`
- `signUp(email, password, hospitalData)`
- `signIn(email, password)`
- `signOut()`
- `getCurrentUser()`
- `getSession()`

#### `hospitalService`
- `getMyHospital(userId)`
- `updateHospital(hospitalId, updates)`
- `getCurrentResources(hospitalId)`
- `updateResources(hospitalId, resources)`
- `getResourcesHistory(hospitalId, limit)`

#### `serviceService`
- `getHospitalServices(hospitalId)`
- `upsertService(hospitalId, serviceData)`
- `updateServiceStatus(hospitalId, serviceType, updates)`
- `getServiceHistory(hospitalId, serviceType, limit)`
- `recordServiceSnapshot(hospitalId, serviceType, data)`

## 🤝 Contribution

Ce projet fait partie de l'écosystème PulseAI.

## 📄 Licence

Propriétaire - PulseAI Team

## 👥 Équipe

Voir [TEAM.md](../TEAM.md) pour la liste complète de l'équipe.

## 📞 Support

Pour toute question ou problème, contactez l'équipe PulseAI.

---

**Note :** Ce dashboard est conçu spécifiquement pour les hôpitaux partenaires de PulseAI. Les données collectées alimentent le système de recommandation de l'application mobile.
